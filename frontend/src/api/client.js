import axios from 'axios'

// Vite proxy forwards /api and /auth → http://localhost:5000
// so no baseURL needed — works in dev and prod (same origin)
const client = axios.create({
  withCredentials: true,   // send JWT cookie on every request
  headers: { 'Content-Type': 'application/json' },
})

// Global response interceptor — handle 401 centrally
client.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      // Not logged in — clear any stale state
      // (AuthContext will handle redirect)
      window.dispatchEvent(new Event('auth:unauthorized'))
    }
    return Promise.reject(err)
  }
)

export default client
