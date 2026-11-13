// 카드 일러스트 SVG 생성: node scripts/cards/build.mjs
// 결과물: public/cards/{id}.svg (78장) + back.svg
import { mkdirSync, readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { majors } from './major.mjs'
import { minors } from './minor.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const outDir = process.argv[2] ?? join(here, '../../public/cards')
const handmadeDir = join(here, 'handmade')

mkdirSync(outDir, { recursive: true })

let count = 0
for (const [id, draw] of Object.entries({ ...majors, ...minors })) {
  writeFileSync(join(outDir, `${id}.svg`), draw())
  count++
}
for (const file of readdirSync(handmadeDir)) {
  if (!file.endsWith('.svg')) continue
  const target = file === 'back-a.svg' ? 'back.svg' : file === 'back-b.svg' ? null : file
  if (!target) continue
  writeFileSync(join(outDir, target), readFileSync(join(handmadeDir, file)))
  count++
}
console.log(`cards: ${count} files → ${outDir}`)
