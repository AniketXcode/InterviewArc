import axios from 'axios'

const AUTH_TOKEN_KEY = 'interviewarc_auth_token'

export const getStoredAuthToken = () => {
  if (typeof window === 'undefined') {
    return ''
  }

  return localStorage.getItem(AUTH_TOKEN_KEY) || ''
}

export const applyAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
    return
  }

  delete axios.defaults.headers.common.Authorization
}

export const persistAuthToken = (token) => {
  if (typeof window === 'undefined') {
    return
  }

  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
    applyAuthToken(token)
    return
  }

  localStorage.removeItem(AUTH_TOKEN_KEY)
  applyAuthToken('')
}

export const bootstrapAuthToken = () => {
  const token = getStoredAuthToken()
  applyAuthToken(token)
  return token
}
