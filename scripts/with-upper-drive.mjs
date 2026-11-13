// 사용법: node scripts/with-upper-drive.mjs <명령...>
// Windows에서 셸 경로가 소문자 드라이브(d:\)로 잡히면 `react-router dev`가 모든 페이지에 404를 낸다
// (대문자 D:\에서 띄우면 정상). 작업 경로와, npm이 PATH에 넣은 node_modules\.bin 경로의
// 드라이브 문자를 대문자로 바꿔서 명령을 실행한다(실행 파일 경로도 소문자면 똑같이 깨진다).
import { spawn } from 'node:child_process'
import { delimiter } from 'node:path'

const upperDrive = (p) => p.replace(/^[a-z]:/, (drive) => drive.toUpperCase())
const cwd = upperDrive(process.cwd())
const pathKey = Object.keys(process.env).find((key) => key.toUpperCase() === 'PATH') ?? 'PATH'
const env = { ...process.env, [pathKey]: (process.env[pathKey] ?? '').split(delimiter).map(upperDrive).join(delimiter) }

const child = spawn(process.argv.slice(2).join(' '), { cwd, env, stdio: 'inherit', shell: true })

for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal))
child.on('exit', (code, signal) => process.exit(signal ? 1 : (code ?? 0)))
