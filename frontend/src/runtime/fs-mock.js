// fs-mock.js — Browser stub for Node's 'fs' module
// Used so the H-Script interpreter can be bundled for browser use.
// lele (import) is disabled in browser mode.

export const readFileSync = () => {
  throw new Error("[Browser] lele (file import) is not supported in the browser IDE. Use the desktop REPL for multi-file projects.")
}

export const existsSync    = () => false
export const writeFileSync = () => {}
export const appendFileSync= () => {}
export const unlinkSync    = () => {}
export const mkdirSync     = () => {}
export const readdirSync   = () => []

export default {
  readFileSync,
  existsSync,
  writeFileSync,
  appendFileSync,
  unlinkSync,
  mkdirSync,
  readdirSync,
}
