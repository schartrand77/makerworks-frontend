import os
from datetime import datetime, timedelta

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr
import redis
import json
from sqlalchemy import Column, Integer, String, DateTime, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///./users.db')
JWT_SECRET = os.getenv('JWT_SECRET', 'changeme')
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES', '30'))
REDIS_URL = os.getenv('REDIS_URL', 'redis://localhost:6379/0')

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if DATABASE_URL.startswith('sqlite') else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

redis_client = redis.Redis.from_url(REDIS_URL, decode_responses=True)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/signin")

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str

class UserSignIn(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: EmailStr
    username: str
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str


class CartItem(BaseModel):
    id: str
    name: str
    price: float
    quantity: int


class SessionData(BaseModel):
    user_id: int
    avatar_url: str | None = None
    cart: list[CartItem] = []


class AuthResponse(BaseModel):
    """Returned after successful authentication."""

    user: UserOut
    token: str

app = FastAPI()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm="HS256")
    return encoded_jwt


def get_session_key(user_id: int) -> str:
    return f"session:{user_id}"


def load_session(user_id: int) -> SessionData:
    raw = redis_client.get(get_session_key(user_id))
    if not raw:
        return SessionData(user_id=user_id)
    try:
        data = json.loads(raw)
        return SessionData(**data)
    except Exception:
        return SessionData(user_id=user_id)


def save_session(data: SessionData) -> None:
    redis_client.set(get_session_key(data.user_id), data.json())


def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                          detail="Could not validate credentials",
                                          headers={"WWW-Authenticate": "Bearer"})
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user_id: int = int(payload.get("sub"))
    except (JWTError, TypeError, ValueError):
        raise credentials_exception
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user

@app.post('/auth/signup')
def signup(user_in: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter((User.email == user_in.email) | (User.username == user_in.username)).first():
        raise HTTPException(status_code=400, detail="User already exists")
    hashed = pwd_context.hash(user_in.password)
    user = User(email=user_in.email, username=user_in.username, hashed_password=hashed)
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"message": "User created"}

@app.post('/auth/signin', response_model=AuthResponse)
def signin(form: UserSignIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form.email).first()
    if not user or not pwd_context.verify(form.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": str(user.id)})
    # create initial session in redis if not present
    session = load_session(user.id)
    save_session(session)
    return {"user": user, "token": token}

@app.get('/auth/me', response_model=UserOut)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user


@app.get('/session', response_model=SessionData)
def get_session(current_user: User = Depends(get_current_user)):
    return load_session(current_user.id)


class AvatarPayload(BaseModel):
    avatar_url: str


@app.post('/session/avatar')
def set_avatar(payload: AvatarPayload, current_user: User = Depends(get_current_user)):
    session = load_session(current_user.id)
    session.avatar_url = payload.avatar_url
    save_session(session)
    return {"status": "ok"}


class CartPayload(BaseModel):
    items: list[CartItem]


@app.post('/session/cart')
def set_cart(payload: CartPayload, current_user: User = Depends(get_current_user)):
    session = load_session(current_user.id)
    session.cart = payload.items
    save_session(session)
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

