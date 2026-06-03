const prisma = require('../lib/prisma')

// ── GET /api/files — list all user's files ────────────────
async function getFiles(req, res) {
  try {
    const files = await prisma.file.findMany({
      where:   { userId: req.user.id },
      orderBy: { updatedAt: 'desc' },
    })
    res.json({ files })
  } catch (err) {
    console.error('getFiles error:', err)
    res.status(500).json({ error: 'Could not fetch files' })
  }
}

// ── GET /api/files/:id — get one file ────────────────────
async function getFile(req, res) {
  try {
    const file = await prisma.file.findUnique({ where: { id: req.params.id } })
    if (!file)                       return res.status(404).json({ error: 'File not found' })
    if (file.userId !== req.user.id) return res.status(403).json({ error: 'Not your file' })
    res.json({ file })
  } catch (err) {
    console.error('getFile error:', err)
    res.status(500).json({ error: 'Could not fetch file' })
  }
}

// ── POST /api/files — create/save file ───────────────────
async function createFile(req, res) {
  try {
    const { filename, code } = req.body
    const lines = (code || '').split('\n').length

    const file = await prisma.file.create({
      data: {
        userId:   req.user.id,
        filename: filename.trim(),
        code:     code || '',
        lines,
      },
    })
    res.status(201).json({ file })
  } catch (err) {
    console.error('createFile error:', err)
    res.status(500).json({ error: 'Could not save file' })
  }
}

// ── PUT /api/files/:id — update file ─────────────────────
async function updateFile(req, res) {
  try {
    const existing = await prisma.file.findUnique({ where: { id: req.params.id } })
    if (!existing)                        return res.status(404).json({ error: 'File not found' })
    if (existing.userId !== req.user.id)  return res.status(403).json({ error: 'Not your file' })

    const { filename, code } = req.body
    const lines = (code ?? existing.code).split('\n').length

    const file = await prisma.file.update({
      where: { id: req.params.id },
      data:  {
        filename: filename?.trim() ?? existing.filename,
        code:     code            ?? existing.code,
        lines,
      },
    })
    res.json({ file })
  } catch (err) {
    console.error('updateFile error:', err)
    res.status(500).json({ error: 'Could not update file' })
  }
}

// ── DELETE /api/files/:id ─────────────────────────────────
async function deleteFile(req, res) {
  try {
    const existing = await prisma.file.findUnique({ where: { id: req.params.id } })
    if (!existing)                        return res.status(404).json({ error: 'File not found' })
    if (existing.userId !== req.user.id)  return res.status(403).json({ error: 'Not your file' })

    await prisma.file.delete({ where: { id: req.params.id } })
    res.json({ message: 'File deleted' })
  } catch (err) {
    console.error('deleteFile error:', err)
    res.status(500).json({ error: 'Could not delete file' })
  }
}

// ── POST /api/files/:id/run — increment run counter ──────
async function incrementRun(req, res) {
  try {
    const file = await prisma.file.findUnique({ where: { id: req.params.id } })
    if (!file || file.userId !== req.user.id) return res.status(404).json({ error: 'File not found' })

    const updated = await prisma.file.update({
      where: { id: req.params.id },
      data:  { runs: { increment: 1 } },
    })
    res.json({ runs: updated.runs })
  } catch (err) {
    res.status(500).json({ error: 'Could not update run count' })
  }
}

module.exports = { getFiles, getFile, createFile, updateFile, deleteFile, incrementRun }
