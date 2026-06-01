/**
 * H-Script file storage — persists code files in localStorage
 */

const STORAGE_KEY = 'hscript_files'

export function getAllFiles() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveFile(filename, code) {
  const files = getAllFiles()
  const now   = new Date().toISOString()
  const idx   = files.findIndex(f => f.filename === filename)

  if (idx >= 0) {
    files[idx] = { ...files[idx], code, updatedAt: now, lines: code.split('\n').length }
  } else {
    files.unshift({
      id:        `f_${Date.now()}`,
      filename,
      code,
      lines:     code.split('\n').length,
      createdAt: now,
      updatedAt: now,
      runs:      0,
    })
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(files))
  return files
}

export function incrementRuns(filename) {
  const files = getAllFiles()
  const idx   = files.findIndex(f => f.filename === filename)
  if (idx >= 0) {
    files[idx].runs = (files[idx].runs || 0) + 1
    localStorage.setItem(STORAGE_KEY, JSON.stringify(files))
  }
}

export function deleteFile(id) {
  const files = getAllFiles().filter(f => f.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(files))
  return files
}

export function getFile(id) {
  return getAllFiles().find(f => f.id === id) || null
}

export function formatRelative(isoString) {
  if (!isoString) return 'Never'
  const diff = Date.now() - new Date(isoString).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins  < 1)  return 'Just now'
  if (mins  < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}
