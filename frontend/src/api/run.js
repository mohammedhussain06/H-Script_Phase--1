import client from './client'

export const runApi = {
  // POST /api/run — execute H-Script server-side
  run: (code) =>
    client.post('/api/run', { code }).then(r => r.data),
}
