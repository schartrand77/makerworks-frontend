import os
from datetime import datetime, timedelta

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr
from sqlalchemy import Column, Integer, String, DateTime, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from dotenv import load_dotenv
import redis
import json

load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///./users.db')
JWT_SECRET = os.getenv('JWT_SECRET', 'changeme')
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES', '30'))

# Redis configuration
REDIS_HOST = os.getenv('REDIS_HOST', 'localhost')
REDIS_PORT = int(os.getenv('REDIS_PORT', '6379'))
REDIS_DB = int(os.getenv('REDIS_DB', '0'))
REDIS_PASSWORD = os.getenv('REDIS_PASSWORD')
SESSION_EXPIRE_SECONDS = int(os.getenv('SESSION_EXPIRE_SECONDS', '7200'))

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if DATABASE_URL.startswith('sqlite') else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Initialise Redis client
redis_client = redis.Redis(
    host=REDIS_HOST,
    port=REDIS_PORT,
    db=REDIS_DB,
    password=REDIS_PASSWORD,
    decode_responses=True,
)

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


def create_session(token: str, user: "User") -> None:
    """Store session data in Redis."""
    session_key = f"session:{token}"
    data = {"user_id": user.id, "username": user.username, "email": user.email}
    redis_client.setex(session_key, SESSION_EXPIRE_SECONDS, json.dumps(data))


def delete_session(token: str) -> None:
    redis_client.delete(f"session:{token}")


def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                          detail="Could not validate credentials",
                                          headers={"WWW-Authenticate": "Bearer"})
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user_id: int = int(payload.get("sub"))
    except (JWTError, TypeError, ValueError):
        raise credentials_exception

    session_key = f"session:{token}"
    if not redis_client.exists(session_key):
        raise credentials_exception

    # refresh expiry
    redis_client.expire(session_key, SESSION_EXPIRE_SECONDS)

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user

@app.post('/auth/signup', response_model=AuthResponse)
def signup(user_in: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter((User.email == user_in.email) | (User.username == user_in.username)).first():
        raise HTTPException(status_code=400, detail="User already exists")
    hashed = pwd_context.hash(user_in.password)
    user = User(email=user_in.email, username=user_in.username, hashed_password=hashed)
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id)})
    create_session(token, user)

    return {"user": user, "token": token}

@app.post('/auth/signin', response_model=AuthResponse)
def signin(form: UserSignIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form.email).first()
    if not user or not pwd_context.verify(form.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": str(user.id)})
    create_session(token, user)
    return {"user": user, "token": token}


@app.post('/auth/signout')
def signout(token: str = Depends(oauth2_scheme)):
    delete_session(token)
    return {"message": "Signed out"}

@app.get('/auth/me', response_model=UserOut)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

