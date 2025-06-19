export const saveToken = (token) => {
  const decoded = parseJwt(token)
  if (decoded?.exp) {
    localStorage.setItem('token', token)
    localStorage.setItem('token_exp', decoded.exp.toString())
  } else {
    console.warn('Token missing expiration claim')
    clearToken()
  }
}

export const getToken = () => {
  const exp = parseInt(localStorage.getItem('token_exp'), 10)
  const now = Math.floor(Date.now() / 1000)
  if (!exp || now >= exp) {
    clearToken()
    return null
  }
  return localStorage.getItem('token')
}

export const clearToken = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('token_exp')
}

export const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch (e) {
    console.error('Failed to parse JWT', e)
    return null
  }
}