// path-mock.js — Browser stub for Node's 'path' module

export const sep      = '/'
export const delimiter = ':'

export function join(...parts) {
  return parts.filter(Boolean).join('/').replace(/\/+/g, '/')
}

export function resolve(...parts) {
  return join(...parts)
}

export function dirname(p) {
  return p.substring(0, p.lastIndexOf('/')) || '.'
}

export function basename(p, ext) {
  const base = p.split('/').pop()
  return ext && base.endsWith(ext) ? base.slice(0, -ext.length) : base
}

export function extname(p) {
  const base = basename(p)
  const idx  = base.lastIndexOf('.')
  return idx > 0 ? base.slice(idx) : ''
}

export default { sep, delimiter, join, resolve, dirname, basename, extname }
