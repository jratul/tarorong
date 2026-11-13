// public/favicon.svg → apple-touch-icon.png(180) 생성: npm run icons
import sharp from 'sharp'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const publicDir = join(dirname(fileURLToPath(import.meta.url)), '../public')
const source = join(publicDir, 'favicon.svg')

await sharp(source, { density: 600 }).resize(180, 180).png().toFile(join(publicDir, 'apple-touch-icon.png'))
console.log('icons: apple-touch-icon.png')
