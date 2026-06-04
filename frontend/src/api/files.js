import client from './client'

export const filesApi = {
  // GET /api/files
  getAll: () =>
    client.get('/api/files').then(r => r.data.files),

  // GET /api/files/:id
  getOne: (id) =>
    client.get(`/api/files/${id}`).then(r => r.data.file),

  // POST /api/files
  create: (filename, code) =>
    client.post('/api/files', { filename, code }).then(r => r.data.file),

  // PUT /api/files/:id
  update: (id, data) =>
    client.put(`/api/files/${id}`, data).then(r => r.data.file),

  // DELETE /api/files/:id
  remove: (id) =>
    client.delete(`/api/files/${id}`).then(r => r.data),

  // POST /api/files/:id/run — increment run counter
  incrementRun: (id) =>
    client.post(`/api/files/${id}/run`).then(r => r.data),
}
