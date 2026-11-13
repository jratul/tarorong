// 빌드 결과(build/client)를 Vercel과 같은 규칙으로 내주는 로컬 미리보기 서버: npm run preview
//   1) 파일이 있으면 그대로   2) 폴더면 그 안의 index.html(prerender된 페이지)
//   3) 둘 다 없으면 __spa-fallback.html (SPA 라우트)
// vite preview는 /cards 같은 prerender 경로에 루트 index.html을 내줘서 화면이 두 겹으로 그려진다.
import { createServer } from 'node:http'
import { createReadStream, existsSync, statSync } from 'node:fs'
import { dirname, extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '../build/client')
const port = Number(process.env.PORT ?? 4173)

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.json': 'application/json',
}

function resolveFile(urlPath) {
  const safe = normalize(decodeURIComponent(urlPath)).replace(/^([/\\])+/, '')
  const target = join(root, safe)
  if (!target.startsWith(root)) return null
  if (existsSync(target) && statSync(target).isFile()) return target
  const index = join(target, 'index.html')
  if (existsSync(index)) return index
  return join(root, '__spa-fallback.html')
}

createServer((req, res) => {
  const file = resolveFile(new URL(req.url ?? '/', 'http://localhost').pathname)
  if (!file) {
    res.writeHead(400).end()
    return
  }
  res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' })
  createReadStream(file).pipe(res)
}).listen(port, () => console.log(`preview: http://localhost:${port}`))
