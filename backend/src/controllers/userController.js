const prisma = require('../lib/prisma')

// ── GET /api/user/profile ────────────────────────────────
async function getProfile(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where:  { id: req.user.id },
      select: {
        id:        true,
        name:      true,
        email:     true,
        provider:  true,
        avatar:    true,
        createdAt: true,
        _count:    { select: { files: true } },
      },
    })

    // Aggregate stats
    const stats = await prisma.file.aggregate({
      where: { userId: req.user.id },
      _sum:  { runs: true, lines: true },
    })

    res.json({
      user: {
        ...user,
        fileCount:  user._count.files,
        totalRuns:  stats._sum.runs  ?? 0,
        totalLines: stats._sum.lines ?? 0,
      },
    })
  } catch (err) {
    console.error('getProfile error:', err)
    res.status(500).json({ error: 'Could not fetch profile' })
  }
}

// ── PUT /api/user/profile ────────────────────────────────
async function updateProfile(req, res) {
  try {
    const { name, avatar } = req.body
    const data = {}
    if (name   !== undefined) data.name   = String(name).trim()
    if (avatar !== undefined) data.avatar = String(avatar).trim()

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: 'Nothing to update' })
    }

    const user = await prisma.user.update({
      where:  { id: req.user.id },
      data,
      select: { id: true, name: true, email: true, avatar: true, provider: true },
    })
    res.json({ user })
  } catch (err) {
    console.error('updateProfile error:', err)
    res.status(500).json({ error: 'Could not update profile' })
  }
}

module.exports = { getProfile, updateProfile }
