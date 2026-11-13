// 타로롱 카드 일러스트 공통 부품.
// 모든 카드는 viewBox 0 0 256 372 (프레임의 그림 영역) 기준이다.
// 원칙: 주인공 상징 1개를 크게, 보조 상징은 1~2개만. 작은 장식은 넣지 않는다.

export const W = 256
export const H = 372

export const C = {
  ink: '#1e1a3a',
  navy: '#2c2652',
  deep: '#0f0c22',
  gold: '#ffe9a6',
  goldD: '#e3b45a',
  goldL: '#fff7d1',
  pink: '#ffc7e3',
  rose: '#ffb1d6',
  blush: '#ff8fbf',
  sky: '#b9e6ff',
  skyD: '#7cc4f0',
  lilac: '#e6dcff',
  lilacD: '#a993e6',
  mint: '#8fdcb5',
  mintD: '#5fae95',
  leaf: '#6cc28f',
  cream: '#fff4ea',
  creamD: '#f0d9c8',
  orange: '#ff9f6b',
  red: '#ff7a9a',
  brown: '#a9784f',
  brownD: '#7a5a3f',
  grey: '#d6d1ea',
  greyD: '#8f89ad',
  steel: '#eef0ff',
  steelD: '#a9a3c8',
}

const BG = {
  day: ['#9fd8ff', '#eef8ff'],
  soft: ['#c9ecff', '#f1ebff'],
  night: ['#1b1640', '#3b2f78'],
  storm: ['#0f0c22', '#3a2d72'],
  dusk: ['#ffc7e3', '#e6dcff'],
  sunset: ['#ffd6a6', '#ffc7e3'],
  gold: ['#ffe9a6', '#fff7e6'],
  lilac: ['#d9cffb', '#f3efff'],
  mint: ['#cdf3e1', '#f4fbff'],
  grey: ['#b9b3d6', '#ece9f6'],
  red: ['#ffb39a', '#ffe3d1'],
}

const COMMON_DEFS = `<defs>
<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<path id="s8" d="M0,-10 L1.9,-4.6 L7.07,-7.07 L4.6,-1.9 L10,0 L4.6,1.9 L7.07,7.07 L1.9,4.6 L0,10 L-1.9,4.6 L-7.07,7.07 L-4.6,1.9 L-10,0 L-4.6,-1.9 L-7.07,-7.07 L-1.9,-4.6Z"/>
<path id="spark" d="M0,-9 Q1.5,-1.5 9,0 Q1.5,1.5 0,9 Q-1.5,1.5 -9,0 Q-1.5,-1.5 0,-9Z"/>
<path id="flame" d="M0,-16 Q10,-4 7,4 Q0,11 -7,4 Q-10,-4 0,-16Z"/>
<path id="drop" d="M0,-7 Q6,2 0,6 Q-6,2 0,-7Z"/>
</defs>`

export function svg(body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">${COMMON_DEFS}${body}</svg>\n`
}

export function bg(kind) {
  const [a, b] = BG[kind]
  return `<defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#bg)"/>`
}

const t = (x, y, rot = 0, s = 1, flip = false) =>
  `translate(${x},${y})${rot ? ` rotate(${rot})` : ''}${s !== 1 || flip ? ` scale(${flip ? -s : s},${s})` : ''}`

export const g = (x, y, inner, { rot = 0, s = 1, flip = false } = {}) =>
  `<g transform="${t(x, y, rot, s, flip)}">${inner}</g>`

// ---------- 지형 ----------
export const ground = (y, fill, d = 16) =>
  `<path d="M0,${y} Q128,${y - d} ${W},${y} L${W},${H} L0,${H}Z" fill="${fill}"/>`
export const sea = (y, fill = C.skyD) =>
  `<path d="M0,${y} Q32,${y - 6} 64,${y} T128,${y} T192,${y} T256,${y} L256,${H} L0,${H}Z" fill="${fill}"/>` +
  `<path d="M30,${y + 26} q12,-5 24,0 M170,${y + 40} q12,-5 24,0" stroke="#fff" stroke-width="2" fill="none" opacity=".5" stroke-linecap="round"/>`
export const hills = (y, fill) =>
  `<path d="M0,${y} Q50,${y - 40} 110,${y - 6} Q170,${y - 46} 256,${y - 10} L256,${H} L0,${H}Z" fill="${fill}"/>`
export const mountains = (y, fill = C.lilac) =>
  `<path d="M0,${y} L50,${y - 60} L90,${y - 20} L140,${y - 74} L196,${y - 14} L232,${y - 44} L256,${y - 24} L256,${H} L0,${H}Z" fill="${fill}"/>`

// ---------- 하늘 ----------
export const sun = (x, y, r, face = true) =>
  `<circle cx="${x}" cy="${y}" r="${r * 1.5}" fill="${C.goldL}" opacity=".55"/>` +
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.gold}" stroke="${C.goldD}" stroke-width="2"/>` +
  (face
    ? `<path d="M${x - r * 0.42},${y - r * 0.05} q${r * 0.14},-${r * 0.16} ${r * 0.28},0 M${x + r * 0.14},${y - r * 0.05} q${r * 0.14},-${r * 0.16} ${r * 0.28},0" stroke="#d99a5b" stroke-width="${Math.max(2, r * 0.08)}" fill="none" stroke-linecap="round"/>` +
      `<ellipse cx="${x - r * 0.5}" cy="${y + r * 0.25}" rx="${r * 0.15}" ry="${r * 0.09}" fill="${C.rose}"/><ellipse cx="${x + r * 0.5}" cy="${y + r * 0.25}" rx="${r * 0.15}" ry="${r * 0.09}" fill="${C.rose}"/>` +
      `<path d="M${x - r * 0.15},${y + r * 0.22} q${r * 0.15},${r * 0.16} ${r * 0.3},0" stroke="#d99a5b" stroke-width="${Math.max(2, r * 0.07)}" fill="none" stroke-linecap="round"/>`
    : '')
export const sunRays = (x, y, r, n = 16, fill = C.gold) => {
  let p = ''
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    const a1 = a - Math.PI / n / 1.6
    const a2 = a + Math.PI / n / 1.6
    const R = i % 2 ? r * 1.25 : r * 1.45
    p += `M${(x + Math.cos(a1) * r * 0.95).toFixed(1)},${(y + Math.sin(a1) * r * 0.95).toFixed(1)} L${(x + Math.cos(a) * R).toFixed(1)},${(y + Math.sin(a) * R).toFixed(1)} L${(x + Math.cos(a2) * r * 0.95).toFixed(1)},${(y + Math.sin(a2) * r * 0.95).toFixed(1)}Z `
  }
  return `<path d="${p}" fill="${fill}"/>`
}
export const moonCrescent = (x, y, r, rot = 0, fill = C.gold) =>
  g(
    x,
    y,
    `<path d="M0,${-r} A${r},${r} 0 1,0 0,${r} A${r * 0.78},${r * 0.86} 0 1,1 0,${-r}Z" fill="${fill}" stroke="${C.goldD}" stroke-width="2"/>`,
    { rot },
  )
export const star = (x, y, s = 1, fill = C.gold, glow = false) =>
  `<use href="#s8" transform="${t(x, y, 0, s)}" fill="${fill}"${glow ? ' filter="url(#glow)"' : ''}/>`
export const spark = (x, y, s = 1, fill = '#fff') => `<use href="#spark" transform="${t(x, y, 0, s)}" fill="${fill}"/>`
export const flame = (x, y, s = 1) =>
  `<use href="#flame" transform="${t(x, y, 0, s)}" fill="${C.orange}"/><use href="#flame" transform="${t(x, y + 3 * s, 0, s * 0.5)}" fill="${C.gold}"/>`
export const dots = (pts, fill = '#fff', r = 1.3, op = 0.55) =>
  `<g fill="${fill}" opacity="${op}">${pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g>`
export const cloud = (x, y, s = 1, fill = '#fff', face = false) =>
  g(
    x,
    y,
    `<g fill="${fill}"><circle cx="-22" cy="4" r="16"/><circle cx="0" cy="-6" r="21"/><circle cx="22" cy="4" r="16"/><rect x="-38" y="2" width="76" height="18" rx="9"/></g>` +
      (face
        ? `<path d="M-10,4 q3,3 6,0 M4,4 q3,3 6,0" stroke="${C.lilacD}" stroke-width="2" fill="none" stroke-linecap="round"/>`
        : ''),
    { s },
  )
export const rain = (pts) =>
  `<g stroke="${C.sky}" stroke-width="2.5" stroke-linecap="round" opacity=".8">${pts.map(([x, y]) => `<path d="M${x},${y} l-4,10"/>`).join('')}</g>`

// ---------- 젤리 캐릭터 ----------
const JC = {
  pink: ['#ffc7e3', '#ffb1d6'],
  sky: ['#b9e6ff', '#94d0f2'],
  lilac: ['#e6dcff', '#c9b8ff'],
  gold: ['#ffe9a6', '#f5d27a'],
  mint: ['#bff0d6', '#8fdcb5'],
  cream: ['#fff4ea', '#f0d9c8'],
  white: ['#ffffff', '#e6dcff'],
  grey: ['#d6d1ea', '#b3acd0'],
  peach: ['#ffd6c2', '#ffb89a'],
  purple: ['#8d7fd1', '#6e60b8'],
  dark: ['#4b3f86', '#3a3070'],
}
const ARMS = {
  down: [
    [-42, -24, -35],
    [42, -24, 35],
  ],
  up: [
    [-42, -66, -55],
    [42, -66, 55],
  ],
  out: [
    [-48, -40, 0],
    [48, -40, 0],
  ],
  front: [
    [-20, -22, -10],
    [20, -22, 10],
  ],
  lup: [
    [-42, -66, -55],
    [42, -24, 35],
  ],
  rup: [
    [-42, -24, -35],
    [42, -66, 55],
  ],
  rout: [
    [-42, -24, -35],
    [50, -42, 0],
  ],
  lout: [
    [-50, -42, 0],
    [42, -24, 35],
  ],
  cross: [
    [-10, -30, -20],
    [10, -34, 20],
  ],
}
const EYE = (x, y) =>
  `<circle cx="${x}" cy="${y}" r="3.8" fill="${C.ink}"/><circle cx="${x + 1.2}" cy="${y - 1.2}" r="1.2" fill="#fff"/>`
const FACES = {
  smile:
    EYE(-11, -50) +
    EYE(11, -50) +
    `<path d="M-5,-41 q5,5 10,0" stroke="${C.ink}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`,
  happy:
    `<path d="M-17,-49 q6,-7 12,0 M5,-49 q6,-7 12,0" stroke="${C.ink}" stroke-width="2.8" fill="none" stroke-linecap="round"/>` +
    `<path d="M-7,-42 q7,8 14,0Z" fill="${C.ink}"/>`,
  calm:
    `<path d="M-16,-50 q5,5 10,0 M6,-50 q5,5 10,0" stroke="${C.ink}" stroke-width="2.4" fill="none" stroke-linecap="round"/>` +
    `<path d="M-4,-40 q4,3 8,0" stroke="${C.ink}" stroke-width="2" fill="none" stroke-linecap="round"/>`,
  sad:
    EYE(-11, -48) +
    EYE(11, -48) +
    `<path d="M-19,-57 l10,-4 M19,-57 l-10,-4" stroke="${C.ink}" stroke-width="2.2" stroke-linecap="round"/>` +
    `<path d="M-5,-37 q5,-5 10,0" stroke="${C.ink}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`,
  cry:
    EYE(-11, -48) +
    EYE(11, -48) +
    `<path d="M-19,-57 l10,-4 M19,-57 l-10,-4" stroke="${C.ink}" stroke-width="2.2" stroke-linecap="round"/>` +
    `<path d="M-5,-37 q5,-5 10,0" stroke="${C.ink}" stroke-width="2.2" fill="none" stroke-linecap="round"/>` +
    `<use href="#drop" transform="translate(-16,-38) scale(.8)" fill="${C.skyD}"/>`,
  surprised: EYE(-11, -50) + EYE(11, -50) + `<ellipse cx="0" cy="-38" rx="3.6" ry="4.6" fill="${C.ink}"/>`,
  smug:
    `<path d="M-17,-50 h11 M6,-50 h11" stroke="${C.ink}" stroke-width="2.8" stroke-linecap="round"/>` +
    `<path d="M-5,-41 q6,4 11,-2" stroke="${C.ink}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`,
  determined:
    EYE(-11, -49) +
    EYE(11, -49) +
    `<path d="M-19,-60 l10,4 M19,-60 l-10,4" stroke="${C.ink}" stroke-width="2.4" stroke-linecap="round"/>` +
    `<path d="M-5,-40 h10" stroke="${C.ink}" stroke-width="2.2" stroke-linecap="round"/>`,
  worried:
    EYE(-11, -49) +
    EYE(11, -49) +
    `<path d="M-6,-39 q3,-3 6,0 q3,3 6,0" stroke="${C.ink}" stroke-width="2" fill="none" stroke-linecap="round"/>`,
  sleep:
    `<path d="M-16,-48 q5,4 10,0 M6,-48 q5,4 10,0" stroke="${C.ink}" stroke-width="2.4" fill="none" stroke-linecap="round"/>` +
    `<path d="M-3,-39 h6" stroke="${C.ink}" stroke-width="2" stroke-linecap="round"/>`,
  blind:
    `<rect x="-44" y="-58" width="88" height="13" rx="6" fill="#fff" stroke="${C.grey}" stroke-width="1.5"/>` +
    `<path d="M-4,-36 h8" stroke="${C.ink}" stroke-width="2.2" stroke-linecap="round"/>`,
  dizzy:
    `<path d="M-15,-54 l8,8 M-7,-54 l-8,8 M7,-54 l8,8 M15,-54 l-8,8" stroke="${C.ink}" stroke-width="2.4" stroke-linecap="round"/>` +
    `<path d="M-5,-37 q5,-4 10,0" stroke="${C.ink}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`,
  skull:
    `<ellipse cx="-12" cy="-50" rx="7" ry="8" fill="${C.ink}"/><ellipse cx="12" cy="-50" rx="7" ry="8" fill="${C.ink}"/>` +
    `<path d="M-2,-40 l2,-4 l2,4Z" fill="${C.ink}"/><path d="M-10,-33 h20 M-6,-36 v6 M0,-36 v6 M6,-36 v6" stroke="${C.ink}" stroke-width="1.8" stroke-linecap="round"/>`,
  back: '',
}
export function jelly(
  x,
  y,
  {
    s = 1,
    color = 'pink',
    face = 'smile',
    rot = 0,
    flip = false,
    arms = null,
    feet = true,
    blush = true,
    under = '',
    acc = '',
    over = '',
  } = {},
) {
  const [c, d] = JC[color] ?? [color, color]
  const armList = typeof arms === 'string' ? ARMS[arms] : arms
  const armSvg = (armList ?? [])
    .map(
      ([ax, ay, ar]) =>
        `<ellipse cx="${ax}" cy="${ay}" rx="11" ry="7" fill="${c}" stroke="${d}" stroke-width="2" transform="rotate(${ar} ${ax} ${ay})"/>`,
    )
    .join('')
  const feetSvg = feet
    ? `<ellipse cx="-17" cy="0" rx="12" ry="6" fill="${d}"/><ellipse cx="17" cy="0" rx="12" ry="6" fill="${d}"/>`
    : ''
  const body = `<path d="M-42,0 C-46,-50 -26,-84 0,-84 C26,-84 46,-50 42,0 Q0,8 -42,0Z" fill="${c}"/>`
  const blushSvg =
    blush && face !== 'back' && face !== 'skull'
      ? `<ellipse cx="-25" cy="-40" rx="7" ry="4" fill="${C.blush}" opacity=".55"/><ellipse cx="25" cy="-40" rx="7" ry="4" fill="${C.blush}" opacity=".55"/>`
      : ''
  return g(x, y, under + feetSvg + armSvg + body + blushSvg + (FACES[face] ?? '') + acc + over, { rot, s, flip })
}

// 젤리 로컬 좌표(몸 높이 84, 아래 중앙이 원점)용 머리 장식
export const hat = {
  crown: (fill = C.gold) =>
    `<path d="M-22,-80 L-24,-104 L-12,-92 L0,-110 L12,-92 L24,-104 L22,-80Z" fill="${fill}" stroke="${C.goldD}" stroke-width="2.5" stroke-linejoin="round"/><circle cx="0" cy="-90" r="3.5" fill="${C.rose}"/>`,
  tiara: () =>
    `<path d="M-20,-80 Q0,-102 20,-80 Q0,-88 -20,-80Z" fill="${C.gold}" stroke="${C.goldD}" stroke-width="2"/><circle cx="0" cy="-92" r="4" fill="${C.sky}"/>`,
  starCrown: () => {
    let s = ''
    for (let i = 0; i < 7; i++) {
      const a = Math.PI + (i / 6) * Math.PI
      s += `<use href="#s8" transform="translate(${(Math.cos(a) * 34).toFixed(1)},${(-84 + Math.sin(a) * 26).toFixed(1)}) scale(.75)" fill="${C.gold}" stroke="${C.goldD}" stroke-width="1"/>`
    }
    return s
  },
  triple: () =>
    `<path d="M-18,-80 L-14,-120 Q0,-134 14,-120 L18,-80Z" fill="${C.gold}" stroke="${C.goldD}" stroke-width="2.5"/>` +
    `<path d="M-17,-92 h34 M-15,-104 h30 M-13,-115 h26" stroke="${C.goldD}" stroke-width="3"/><circle cx="0" cy="-130" r="4" fill="${C.gold}" stroke="${C.goldD}" stroke-width="2"/>`,
  hood: (fill = C.grey) =>
    `<path d="M-44,-20 C-50,-70 -28,-104 0,-106 C28,-104 50,-70 44,-20 L34,-24 C38,-62 22,-86 0,-86 C-22,-86 -38,-62 -34,-24Z" fill="${fill}"/>`,
  feather: (fill = C.mint) =>
    `<path d="M-30,-72 Q0,-120 34,-70 Q0,-84 -30,-72Z" fill="${fill}"/><path d="M14,-94 q22,-30 42,-22 q-20,6 -36,30Z" fill="${C.red}"/>`,
  helmet: (plume = C.red) =>
    `<path d="M-36,-60 C-36,-96 36,-96 36,-60Z" fill="${C.steel}" stroke="${C.steelD}" stroke-width="2.5"/><path d="M-36,-62 h72" stroke="${C.steelD}" stroke-width="3"/>` +
    `<path d="M0,-90 q10,-26 34,-24 q-16,8 -26,28Z" fill="${plume}"/>`,
  wingHelm: () =>
    `<path d="M-36,-60 C-36,-96 36,-96 36,-60Z" fill="${C.steel}" stroke="${C.steelD}" stroke-width="2.5"/>` +
    `<path d="M-34,-80 q-22,-10 -26,-30 q14,6 28,18Z M34,-80 q22,-10 26,-30 q-14,6 -28,18Z" fill="#fff" stroke="${C.steelD}" stroke-width="2"/>`,
  halo: () =>
    `<ellipse cx="0" cy="-92" rx="30" ry="8" fill="none" stroke="${C.gold}" stroke-width="5" filter="url(#glow)"/>`,
  horns: (fill = C.ink) =>
    `<path d="M-26,-74 Q-40,-100 -24,-108 Q-30,-90 -14,-80Z M26,-74 Q40,-100 24,-108 Q30,-90 14,-80Z" fill="${fill}"/>`,
  wreath: () => {
    let s = ''
    for (let i = 0; i < 9; i++) {
      const a = Math.PI * 1.08 + (i / 8) * Math.PI * 0.84
      const x = Math.cos(a) * 30
      const y = -78 + Math.sin(a) * 18
      s += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="7" ry="3.6" fill="${C.leaf}" transform="rotate(${((a * 180) / Math.PI + 90).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`
    }
    return s
  },
  flowers: () =>
    [-24, -12, 0, 12, 24]
      .map(
        (x, i) =>
          `<circle cx="${x}" cy="${-80 - (i % 2 ? 6 : 2)}" r="6" fill="${i % 2 ? C.pink : '#fff'}" stroke="${C.rose}" stroke-width="1.5"/>`,
      )
      .join(''),
  beard: () =>
    `<path d="M-26,-38 Q-30,-6 0,4 Q30,-6 26,-38 Q14,-30 0,-32 Q-14,-30 -26,-38Z" fill="#fff" stroke="${C.grey}" stroke-width="2"/>` +
    `<path d="M-10,-36 q10,-6 20,0" stroke="${C.grey}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  bandage: () =>
    `<path d="M-38,-66 Q0,-82 38,-66 L36,-58 Q0,-72 -36,-58Z" fill="#fff" stroke="${C.grey}" stroke-width="1.5"/><path d="M-6,-72 l4,6 M2,-73 l4,6" stroke="${C.grey}" stroke-width="1.5"/>`,
  cape: (fill = C.red) => `<path d="M-40,-64 Q-60,-20 -48,2 L48,2 Q60,-20 40,-64 Q0,-50 -40,-64Z" fill="${fill}"/>`,
  robe: (fill = C.sky) =>
    `<path d="M-44,-2 Q-43,-20 -38,-30 Q0,-20 38,-30 Q43,-20 44,-2 Q0,8 -44,-2Z" fill="${fill}" opacity=".95"/>`,
  veil: (fill = C.lilac) =>
    `<path d="M-30,-82 Q-56,-40 -50,2 L-38,2 Q-42,-40 -22,-78Z M30,-82 Q56,-40 50,2 L38,2 Q42,-40 22,-78Z" fill="${fill}"/>`,
  infinity: () =>
    `<path d="M0,-104 C-6,-112 -20,-112 -20,-104 C-20,-96 -6,-96 0,-104 C6,-112 20,-112 20,-104 C20,-96 6,-96 0,-104Z" fill="none" stroke="${C.goldD}" stroke-width="4"/>`,
  ears: (fill = '#ffffff') => `<path d="M-30,-68 L-38,-100 L-12,-80Z M30,-68 L38,-100 L12,-80Z" fill="${fill}"/>`,
}

// ---------- 수트 상징 ----------
export function wand(x, y, len = 150, rot = 0, s = 1) {
  const leaves = [0.18, 0.42, 0.68]
    .map((p, i) => {
      const yy = -len * p
      const side = i % 2 ? 1 : -1
      return `<path d="M0,${yy} q${side * 14},-6 ${side * 18},-18 q${side * -12},2 ${side * -18},18Z" fill="${C.leaf}"/>`
    })
    .join('')
  return g(
    x,
    y,
    `<path d="M0,0 L0,${-len}" stroke="${C.brown}" stroke-width="9" stroke-linecap="round"/><path d="M-2,-6 L-2,${-len + 6}" stroke="#c99a6e" stroke-width="2.5" stroke-linecap="round"/>${leaves}<path d="M0,${-len} q-8,-10 -2,-18 q8,6 2,18Z" fill="${C.leaf}"/>`,
    { rot, s },
  )
}
export function cup(x, y, s = 1, { heart = true, rot = 0, fill = C.gold, water = true, lid = false } = {}) {
  return g(
    x,
    y,
    `<path d="M-14,0 Q0,-14 14,0Z" fill="${fill}" stroke="${C.goldD}" stroke-width="2.5" stroke-linejoin="round"/>` +
      `<rect x="-3.5" y="-26" width="7" height="22" fill="${fill}" stroke="${C.goldD}" stroke-width="2.5"/>` +
      `<path d="M-22,-58 L22,-58 Q20,-30 0,-25 Q-20,-30 -22,-58Z" fill="${fill}" stroke="${C.goldD}" stroke-width="2.5"/>` +
      `<ellipse cx="0" cy="-58" rx="22" ry="5" fill="#fff3c9" stroke="${C.goldD}" stroke-width="2.5"/>` +
      (water && !lid ? `<ellipse cx="0" cy="-58" rx="17" ry="3" fill="#9fd8ff"/>` : '') +
      (lid
        ? `<path d="M-20,-60 Q0,-86 20,-60Z" fill="${fill}" stroke="${C.goldD}" stroke-width="2.5"/><path d="M0,-80 v-10 M-5,-85 h10" stroke="${C.goldD}" stroke-width="3" stroke-linecap="round"/>`
        : '') +
      (heart ? `<path d="M0,-32 C-9,-38 -7,-48 0,-43 C7,-48 9,-38 0,-32Z" fill="${C.rose}"/>` : ''),
    { s, rot },
  )
}
export function sword(x, y, len = 160, rot = 0, s = 1) {
  return g(
    x,
    y,
    `<path d="M-6,-10 L-6,${-len + 16} L0,${-len} L6,${-len + 16} L6,-10Z" fill="${C.steel}" stroke="${C.steelD}" stroke-width="2.5" stroke-linejoin="round"/>` +
      `<path d="M0,-14 L0,${-len + 18}" stroke="${C.steelD}" stroke-width="1.5" opacity=".7"/>` +
      `<rect x="-18" y="-13" width="36" height="7" rx="3.5" fill="${C.gold}" stroke="${C.goldD}" stroke-width="2"/>` +
      `<rect x="-4" y="-7" width="8" height="18" rx="3" fill="${C.brown}"/><circle cx="0" cy="14" r="5" fill="${C.gold}" stroke="${C.goldD}" stroke-width="2"/>`,
    { rot, s },
  )
}
export function pentacle(x, y, r = 30) {
  let p = ''
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i * 4 * Math.PI) / 5
    p += `${i ? 'L' : 'M'}${(x + Math.cos(a) * r * 0.66).toFixed(1)},${(y + Math.sin(a) * r * 0.66).toFixed(1)} `
  }
  return (
    `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.gold}" stroke="${C.goldD}" stroke-width="${Math.max(2, r * 0.09)}"/>` +
    `<circle cx="${x}" cy="${y}" r="${r * 0.78}" fill="none" stroke="${C.goldD}" stroke-width="${Math.max(1.2, r * 0.04)}"/>` +
    `<path d="${p}Z" fill="${C.goldL}" stroke="${C.goldD}" stroke-width="${Math.max(1.5, r * 0.06)}" stroke-linejoin="round"/>`
  )
}
export const heart = (x, y, s = 1, fill = C.rose) =>
  g(
    x,
    y,
    `<path d="M0,22 C-30,2 -26,-24 0,-10 C26,-24 30,2 0,22Z" fill="${fill}" stroke="#ff8fbf" stroke-width="2"/>`,
    { s },
  )

// 구름에서 나온 손 (에이스). 주먹이 (x,y)를 쥔다. side: 1이면 오른쪽 구름
export function fistFromCloud(x, y, side = 1, s = 1) {
  const inner =
    `<path d="M10,-8 Q40,-10 66,-14 L68,10 Q40,10 10,8Z" fill="${C.cream}" stroke="${C.creamD}" stroke-width="2"/>` +
    `<rect x="-12" y="-14" width="28" height="28" rx="11" fill="${C.cream}" stroke="${C.creamD}" stroke-width="2"/>` +
    `<path d="M-12,-5 h12 M-12,3 h12" stroke="${C.creamD}" stroke-width="2" stroke-linecap="round"/>` +
    `<g fill="#fff"><circle cx="70" cy="-8" r="18"/><circle cx="90" cy="-20" r="20"/><circle cx="110" cy="-4" r="17"/><circle cx="88" cy="8" r="16"/></g>` +
    `<path d="M80,-6 q3,3 6,0 M94,-6 q3,3 6,0" stroke="${C.lilacD}" stroke-width="2" fill="none" stroke-linecap="round"/>`
  return g(x, y, inner, { s, flip: side < 0 })
}

// ---------- 동물 ----------
export function horse(x, y, { s = 1, color = '#fff', flip = false, rear = false, mane = C.lilac } = {}) {
  const d = color === '#fff' ? C.grey : 'rgba(30,26,58,.25)'
  const legs = rear
    ? `<path d="M-30,10 l-6,40 M-14,14 l2,38 M28,6 q16,-6 22,-26 M40,0 q18,4 24,-14" stroke="${color}" stroke-width="11" stroke-linecap="round" fill="none"/>`
    : `<path d="M-30,12 l-4,40 M-14,14 l0,40 M20,14 l2,40 M34,10 l6,40" stroke="${color}" stroke-width="11" stroke-linecap="round"/>`
  const hooves = rear
    ? ''
    : `<path d="M-38,52 h10 M-19,54 h10 M17,54 h10 M35,50 h10" stroke="${d}" stroke-width="5" stroke-linecap="round"/>`
  const inner =
    `<path d="M-46,-6 q-22,10 -18,38" stroke="${mane}" stroke-width="10" fill="none" stroke-linecap="round"/>` +
    legs +
    hooves +
    `<ellipse cx="0" cy="0" rx="50" ry="27" fill="${color}" stroke="${d}" stroke-width="2"/>` +
    `<path d="M30,-10 Q40,-46 58,-56 L74,-40 Q56,-30 50,4Z" fill="${color}" stroke="${d}" stroke-width="2"/>` +
    `<ellipse cx="70" cy="-48" rx="20" ry="13" fill="${color}" stroke="${d}" stroke-width="2" transform="rotate(30 70 -48)"/>` +
    `<path d="M54,-64 l2,-14 l8,10Z" fill="${color}" stroke="${d}" stroke-width="2"/>` +
    `<path d="M36,-30 Q40,-58 56,-64" stroke="${mane}" stroke-width="9" fill="none" stroke-linecap="round"/>` +
    `<circle cx="68" cy="-52" r="3" fill="${C.ink}"/><ellipse cx="80" cy="-38" rx="2" ry="1.5" fill="${C.ink}"/>`
  return g(x, y, inner, { s, flip, rot: rear ? -18 : 0 })
}
export function dog(x, y, { s = 1, color = '#fff', ear = C.lilacD, flip = false, howl = false } = {}) {
  const head = howl
    ? `<circle cx="16" cy="-20" r="11" fill="${color}"/><path d="M20,-28 l12,-14 l-2,14Z" fill="${color}"/><path d="M8,-28 q-6,6 -2,14" stroke="${ear}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M18,-22 q2,-2 4,0" stroke="${C.ink}" stroke-width="2" fill="none"/><ellipse cx="30" cy="-38" rx="3" ry="4" fill="${C.ink}"/>`
    : `<circle cx="15" cy="-12" r="11" fill="${color}"/><path d="M9,-20 q-8,4 -4,14" stroke="${ear}" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="18" cy="-13" r="2" fill="${C.ink}"/><circle cx="25.5" cy="-10" r="2" fill="${C.ink}"/>`
  return g(
    x,
    y,
    `<path d="M-16,-2 q-9,-7 -5,-15" stroke="${color}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M-10,6 l-2,10 M8,6 l2,10" stroke="${color}" stroke-width="6" stroke-linecap="round"/><ellipse cx="0" cy="0" rx="18" ry="11" fill="${color}"/>${head}`,
    { s, flip },
  )
}
export function lion(x, y, s = 1) {
  let mane = ''
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2
    mane += `<circle cx="${(Math.cos(a) * 34).toFixed(1)}" cy="${(Math.sin(a) * 34).toFixed(1)}" r="14" fill="${C.orange}"/>`
  }
  return g(
    x,
    y,
    mane +
      `<circle r="34" fill="${C.orange}"/><circle r="28" fill="${C.gold}"/>` +
      `<circle cx="-22" cy="-24" r="8" fill="${C.gold}"/><circle cx="22" cy="-24" r="8" fill="${C.gold}"/>` +
      `<path d="M-14,-6 q4,-4 8,0 M6,-6 q4,-4 8,0" stroke="${C.ink}" stroke-width="2.6" fill="none" stroke-linecap="round"/>` +
      `<path d="M-5,4 h10 l-5,6Z" fill="${C.brownD}"/><path d="M0,10 q-6,6 -10,2 M0,10 q6,6 10,2" stroke="${C.brownD}" stroke-width="2" fill="none" stroke-linecap="round"/>` +
      `<ellipse cx="-16" cy="6" rx="5" ry="3" fill="${C.rose}" opacity=".7"/><ellipse cx="16" cy="6" rx="5" ry="3" fill="${C.rose}" opacity=".7"/>`,
    { s },
  )
}

// ---------- 소품 ----------
export const tree = (x, y, s = 1, fill = C.mintD) =>
  g(
    x,
    y,
    `<path d="M0,0 L0,-50" stroke="${C.brownD}" stroke-width="8" stroke-linecap="round"/><circle cx="0" cy="-66" r="26" fill="${fill}"/><circle cx="-18" cy="-52" r="16" fill="${fill}"/><circle cx="18" cy="-52" r="16" fill="${fill}"/>`,
    { s },
  )
export const castle = (x, y, s = 1, fill = C.lilac) =>
  g(
    x,
    y,
    `<path d="M-30,0 L-30,-40 L-24,-40 L-24,-46 L-18,-46 L-18,-40 L-12,-40 L-12,-46 L-6,-46 L-6,-40 L6,-40 L6,-46 L12,-46 L12,-40 L18,-40 L18,-46 L24,-46 L24,-40 L30,-40 L30,0Z" fill="${fill}"/>` +
      `<path d="M-10,-40 L-10,-66 L10,-66 L10,-40Z" fill="${fill}"/><path d="M-14,-66 L0,-82 L14,-66Z" fill="${C.rose}"/><path d="M-6,0 v-12 a6,6 0 0,1 12,0 v12Z" fill="${C.navy}" opacity=".5"/>`,
    { s },
  )
export const flower = (x, y, s = 1, fill = C.pink) =>
  g(
    x,
    y,
    `<path d="M0,0 L0,-22" stroke="${C.leaf}" stroke-width="3"/><g fill="${fill}"><circle cx="0" cy="-30" r="6"/><circle cx="-6" cy="-24" r="6"/><circle cx="6" cy="-24" r="6"/><circle cx="-4" cy="-18" r="5"/><circle cx="4" cy="-18" r="5"/></g><circle cx="0" cy="-24" r="4" fill="${C.gold}"/>`,
    { s },
  )
export const sunflower = (x, y, s = 1) => {
  let p = ''
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * 360
    p += `<ellipse cx="0" cy="-12" rx="4.5" ry="9" fill="${C.gold}" stroke="${C.goldD}" stroke-width="1" transform="rotate(${a})"/>`
  }
  return g(
    x,
    y,
    `<path d="M0,0 L0,40" stroke="${C.leaf}" stroke-width="4"/><path d="M0,24 q12,-6 16,-16 q-12,0 -16,16Z" fill="${C.leaf}"/>${p}<circle r="8" fill="${C.brown}"/>`,
    { s },
  )
}
export const rose = (x, y, s = 1, fill = '#fff') =>
  g(
    x,
    y,
    `<circle r="11" fill="${fill}" stroke="${C.lilac}" stroke-width="2"/><path d="M-5,0 q5,-6 10,0 q-5,5 -5,0" stroke="${C.lilacD}" stroke-width="2" fill="none"/>`,
    { s },
  )
export const wheat = (x, y, s = 1) =>
  g(
    x,
    y,
    `<path d="M0,0 L0,-40" stroke="${C.goldD}" stroke-width="2.5"/>` +
      [0, 1, 2, 3]
        .map(
          (i) =>
            `<ellipse cx="-4" cy="${-22 - i * 7}" rx="3" ry="5" fill="${C.gold}" stroke="${C.goldD}" transform="rotate(-25 -4 ${-22 - i * 7})"/><ellipse cx="4" cy="${-22 - i * 7}" rx="3" ry="5" fill="${C.gold}" stroke="${C.goldD}" transform="rotate(25 4 ${-22 - i * 7})"/>`,
        )
        .join(''),
    { s },
  )
export const pillar = (x, y, h, fill, letter, ink) =>
  `<rect x="${x - 16}" y="${y - h}" width="32" height="${h}" fill="${fill}"/><rect x="${x - 22}" y="${y - h - 12}" width="44" height="14" rx="4" fill="${fill}"/><rect x="${x - 22}" y="${y - 10}" width="44" height="10" rx="3" fill="${fill}"/>` +
  (letter
    ? `<text x="${x}" y="${y - h / 2 + 10}" text-anchor="middle" font-family="Georgia, serif" font-size="28" font-weight="700" fill="${ink}">${letter}</text>`
    : '')
export const throne = (x, y, w = 110, h = 150, fill = C.lilacD) =>
  `<path d="M${x - w / 2},${y} L${x - w / 2},${y - h + 20} Q${x},${y - h - 16} ${x + w / 2},${y - h + 20} L${x + w / 2},${y}Z" fill="${fill}"/>`
export const banner = (x, y, h, fill, emblem = '') =>
  `<path d="M${x},${y} L${x},${y - h}" stroke="${C.brownD}" stroke-width="5" stroke-linecap="round"/><path d="M${x + 2},${y - h + 4} L${x + 62},${y - h + 4} Q${x + 52},${y - h + 26} ${x + 62},${y - h + 48} L${x + 2},${y - h + 48}Z" fill="${fill}"/>${emblem}`
export const scales = (x, y, s = 1) =>
  g(
    x,
    y,
    `<path d="M0,0 L0,-46 M-36,-40 L36,-40" stroke="${C.goldD}" stroke-width="4" stroke-linecap="round"/><circle cx="0" cy="-48" r="5" fill="${C.gold}" stroke="${C.goldD}" stroke-width="2"/>` +
      `<path d="M-36,-40 L-48,-12 M-36,-40 L-24,-12 M36,-40 L24,-12 M36,-40 L48,-12" stroke="${C.goldD}" stroke-width="2"/>` +
      `<path d="M-52,-12 Q-36,6 -20,-12Z M20,-12 Q36,6 52,-12Z" fill="${C.gold}" stroke="${C.goldD}" stroke-width="2"/>`,
    { s },
  )
export const lantern = (x, y, s = 1) =>
  g(
    x,
    y,
    `<circle cx="0" cy="0" r="40" fill="${C.goldL}" opacity=".35"/><path d="M0,-28 v-10" stroke="${C.goldD}" stroke-width="3"/><path d="M-14,-22 h28 l-4,-6 h-20Z" fill="${C.goldD}"/>` +
      `<rect x="-13" y="-22" width="26" height="36" rx="5" fill="${C.goldL}" stroke="${C.goldD}" stroke-width="3"/><path d="M-14,14 h28 l-5,6 h-18Z" fill="${C.goldD}"/>` +
      `<use href="#s8" transform="translate(0,-4) scale(1)" fill="${C.gold}" stroke="${C.goldD}" stroke-width=".8" filter="url(#glow)"/>`,
    { s },
  )
export const key = (x, y, rot = 0, s = 1) =>
  g(
    x,
    y,
    `<circle cx="0" cy="-34" r="10" fill="none" stroke="${C.goldD}" stroke-width="5"/><path d="M0,-24 L0,24 M0,14 h10 M0,22 h8" stroke="${C.goldD}" stroke-width="5" stroke-linecap="round"/>`,
    { rot, s },
  )
export const wing = (x, y, s = 1, flip = false, fill = '#fff') =>
  g(
    x,
    y,
    `<path d="M0,0 Q-30,-50 -70,-60 Q-60,-40 -64,-30 Q-50,-30 -56,-14 Q-36,-16 -40,0 Q-20,-4 0,0Z" fill="${fill}" stroke="${C.lilac}" stroke-width="2" stroke-linejoin="round"/>`,
    { s, flip },
  )
export const globe = (x, y, r = 16) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.sky}" stroke="${C.skyD}" stroke-width="2.5"/><path d="M${x - r * 0.6},${y - r * 0.3} q${r * 0.4},-${r * 0.4} ${r * 0.7},0 q-${r * 0.1},${r * 0.5} -${r * 0.7},0Z M${x + r * 0.1},${y + r * 0.2} q${r * 0.4},-${r * 0.2} ${r * 0.6},${r * 0.2} q-${r * 0.3},${r * 0.5} -${r * 0.6},-${r * 0.2}Z" fill="${C.mint}"/>`
export const ship = (x, y, s = 1) =>
  g(
    x,
    y,
    `<path d="M-20,0 L20,0 L14,10 L-14,10Z" fill="${C.brown}"/><path d="M0,0 L0,-30" stroke="${C.brownD}" stroke-width="2.5"/><path d="M2,-28 L18,-6 L2,-6Z" fill="#fff"/>`,
    { s },
  )
export const rainbow = (cx, cy, r, w = 9) =>
  ['#ff9fb3', '#ffd27a', '#bff0d6', '#9fd8ff', '#c9b8ff']
    .map(
      (c, i) =>
        `<path d="M${cx - r + i * w},${cy} A${r - i * w},${r - i * w} 0 0,1 ${cx + r - i * w},${cy}" stroke="${c}" stroke-width="${w}" fill="none"/>`,
    )
    .join('')
export const chain = (x1, y1, x2, y2) =>
  `<path d="M${x1},${y1} L${x2},${y2}" stroke="${C.greyD}" stroke-width="3" stroke-dasharray="6 3" stroke-linecap="round"/>`
export const motion = (pts, stroke = '#fff') =>
  `<g stroke="${stroke}" stroke-width="2.5" stroke-linecap="round" opacity=".55">${pts.map(([x, y, dx, dy]) => `<path d="M${x},${y} l${dx},${dy}"/>`).join('')}</g>`
