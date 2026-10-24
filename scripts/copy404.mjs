import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const dist = resolve(root, 'dist')
copyFileSync(
  resolve(dist, 'index.html'),
  resolve(dist, '404.html')
)
console.log('404.html dibuat dari index.html (fallback SPA untuk GitHub Pages)')
