import client from './client'

export const authApi = {
  // POST /auth/signup
  signup: (name, email, password) =>
    client.post('/auth/signup', { name, email, password }).then(r => r.data),

  // POST /auth/login
  login: (email, password) =>
    client.post('/auth/login', { email, password }).then(r => r.data),

  // POST /auth/logout
  logout: () =>
    client.post('/auth/logout').then(r => r.data),

  // GET /auth/me — returns current logged-in user (uses cookie)
  me: () =>
    client.get('/auth/me').then(r => r.data),
}
