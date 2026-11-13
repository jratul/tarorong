// 마이너 아르카나 장면. 컵 에이스는 handmade/ 원본을 쓴다.
// 원칙: 수트 상징의 개수가 한눈에 세어질 것 + 원작의 대표 장면 하나.
import {
  C,
  svg,
  bg,
  g,
  ground,
  sea,
  hills,
  mountains,
  sun,
  moonCrescent,
  spark,
  dots,
  cloud,
  rain,
  jelly,
  hat,
  wand,
  cup,
  sword,
  pentacle,
  heart,
  fistFromCloud,
  horse,
  dog,
  tree,
  castle,
  flower,
  sunflower,
  rose,
  scales,
  wing,
  globe,
  ship,
  rainbow,
  motion,
} from './lib.mjs'

// ---------- 공통 소품 ----------
const pyramids = (y) =>
  `<path d="M20,${y} L52,${y - 34} L84,${y}Z M70,${y} L110,${y - 46} L150,${y}Z M200,${y} L228,${y - 30} L256,${y}Z" fill="#f5d27a"/>`
const blackCat = (x, y, s = 1) =>
  g(
    x,
    y,
    `<path d="M22,-4 q22,-6 18,-34" stroke="#3a3070" stroke-width="7" fill="none" stroke-linecap="round"/>` +
      `<ellipse cx="0" cy="-16" rx="22" ry="18" fill="#3a3070"/><circle cx="0" cy="-44" r="16" fill="#3a3070"/>` +
      `<path d="M-14,-52 L-12,-68 L-2,-58Z M14,-52 L12,-68 L2,-58Z" fill="#3a3070"/>` +
      `<ellipse cx="-6" cy="-45" rx="3" ry="4" fill="${C.gold}"/><ellipse cx="6" cy="-45" rx="3" ry="4" fill="${C.gold}"/>`,
    { s },
  )
const lizard = (x, y, s = 1) =>
  g(
    x,
    y,
    `<path d="M-30,0 Q-10,-14 10,0 Q24,8 34,-4" stroke="${C.orange}" stroke-width="9" fill="none" stroke-linecap="round"/>` +
      `<path d="M-14,-4 l-6,10 M2,0 l4,10 M-6,-6 l-4,-8 M8,-2 l6,-8" stroke="${C.orange}" stroke-width="4" stroke-linecap="round"/>` +
      `<circle cx="-30" cy="0" r="8" fill="${C.orange}"/><circle cx="-33" cy="-2" r="1.6" fill="${C.ink}"/>`,
    { s },
  )
const rabbit = (x, y, s = 1) =>
  g(
    x,
    y,
    `<ellipse cx="0" cy="-14" rx="18" ry="14" fill="#fff" stroke="${C.grey}" stroke-width="2"/><circle cx="-14" cy="-26" r="11" fill="#fff" stroke="${C.grey}" stroke-width="2"/>` +
      `<ellipse cx="-18" cy="-48" rx="4.5" ry="14" fill="#fff" stroke="${C.grey}" stroke-width="2"/><ellipse cx="-9" cy="-48" rx="4.5" ry="14" fill="#fff" stroke="${C.grey}" stroke-width="2"/>` +
      `<circle cx="-17" cy="-27" r="1.8" fill="${C.ink}"/><circle cx="16" cy="-14" r="5" fill="#fff" stroke="${C.grey}" stroke-width="2"/>`,
    { s },
  )
const falcon = (x, y, s = 1) =>
  g(
    x,
    y,
    `<ellipse cx="0" cy="-14" rx="12" ry="17" fill="${C.brown}"/><circle cx="0" cy="-34" r="10" fill="${C.brown}"/>` +
      `<path d="M-10,-38 Q0,-50 10,-38Z" fill="${C.red}"/><path d="M8,-32 l7,3 l-7,3Z" fill="${C.gold}"/><circle cx="3" cy="-34" r="1.8" fill="${C.ink}"/>` +
      `<path d="M-8,-8 q-12,6 -10,18 M8,-8 q6,10 2,18" stroke="${C.brownD}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    { s },
  )
const fish = (x, y, s = 1, rot = 0) =>
  g(
    x,
    y,
    `<path d="M14,0 l14,-10 v20Z" fill="${C.skyD}"/><ellipse cx="0" cy="0" rx="18" ry="11" fill="${C.sky}" stroke="${C.skyD}" stroke-width="2"/><circle cx="-8" cy="-2" r="2.2" fill="${C.ink}"/>`,
    { s, rot },
  )
const house = (x, y, s = 1) =>
  g(x, y, `<rect x="-20" y="-28" width="40" height="28" fill="${C.cream}" stroke="${C.creamD}" stroke-width="2"/><path d="M-26,-26 L0,-46 L26,-26Z" fill="${C.red}"/><rect x="-5" y="-14" width="10" height="14" fill="${C.brown}"/>`, { s })
const birds = (pts) =>
  `<g stroke="${C.navy}" stroke-width="2.5" fill="none" stroke-linecap="round">${pts.map(([x, y]) => `<path d="M${x - 8},${y} q4,-5 8,0 q4,-5 8,0"/>`).join('')}</g>`
const tents = (x, y) => `<path d="M${x - 26},${y} L${x},${y - 34} L${x + 26},${y}Z" fill="${C.red}"/><path d="M${x},${y - 34} L${x},${y}" stroke="#fff" stroke-width="3"/>`
const butterfly = (x, y, s = 1) =>
  g(x, y, `<path d="M0,0 q-14,-14 -16,0 q2,12 16,0Z M0,0 q14,-14 16,0 q-2,12 -16,0Z" fill="${C.pink}" stroke="${C.rose}" stroke-width="1.5"/><path d="M0,-6 v12" stroke="${C.navy}" stroke-width="2"/>`, { s })
const bull = (x, y, s = 1) =>
  g(x, y, `<circle r="13" fill="${C.brown}"/><path d="M-10,-8 q-14,-4 -12,-16 M10,-8 q14,-4 12,-16" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="-5" cy="-2" r="1.8" fill="${C.ink}"/><circle cx="5" cy="-2" r="1.8" fill="${C.ink}"/><ellipse cx="0" cy="6" rx="6" ry="4" fill="${C.rose}"/>`, { s })
const palmHand = (x, y) =>
  g(
    x - 126,
    y - 276,
    `<path d="M146,268 Q176,266 206,262 L208,284 Q176,284 146,282Z" fill="${C.cream}" stroke="${C.creamD}" stroke-width="2"/>` +
      `<path d="M90,270 Q92,286 128,286 Q160,286 162,272 Q150,264 128,265 Q104,265 90,270Z" fill="${C.cream}" stroke="${C.creamD}" stroke-width="2"/>` +
      `<g fill="${C.cream}" stroke="${C.creamD}" stroke-width="2"><circle cx="96" cy="265" r="7"/><circle cx="108" cy="262" r="7"/><circle cx="120" cy="261" r="7"/></g>` +
      `<g fill="#fff"><circle cx="208" cy="272" r="18"/><circle cx="228" cy="260" r="21"/><circle cx="250" cy="274" r="18"/><circle cx="228" cy="284" r="17"/></g>`,
  )
// 칼끝(tx,ty)이 지정된 각도로 꽂힌 칼. a=0이면 수직으로 아래를 향함
const stuckSword = (tx, ty, len, a = 0, s = 0.75) => {
  const r = (a * Math.PI) / 180
  const L = len * s
  return sword(tx - L * Math.sin(r) * -1, ty - L * Math.cos(r), len, 180 + a, s)
}
const coinsArc = (n, y0, amp, r, x0 = 30, x1 = 226) =>
  Array.from({ length: n }, (_, i) => {
    const p = n === 1 ? 0.5 : i / (n - 1)
    return pentacle(x0 + (x1 - x0) * p, y0 - amp * Math.sin(Math.PI * p), r)
  }).join('')

// ---------- 완드 ----------
const wands = {
  'wands-01-ace': () =>
    svg(bg('day') + hills(300, C.mint) + castle(206, 286, 0.8) + wand(104, 330, 270, 0, 1.05) + fistFromCloud(104, 264, 1, 1) + `<ellipse cx="60" cy="200" rx="8" ry="4" fill="${C.leaf}" transform="rotate(30 60 200)"/><ellipse cx="72" cy="250" rx="8" ry="4" fill="${C.leaf}" transform="rotate(-20 72 250)"/>`),
  'wands-02-two': () =>
    svg(
      bg('gold') +
        sea(230, C.skyD) +
        hills(270, C.mint) +
        wand(40, 372, 300) +
        wand(200, 372, 300) +
        jelly(128, 330, { s: 1.15, color: 'peach', face: 'determined', arms: 'rout', acc: `<path d="M-30,-78 Q0,-104 30,-78Z" fill="${C.red}"/>` }) +
        globe(76, 268, 22) +
        `<rect x="0" y="322" width="256" height="50" fill="#d6d1ea"/><path d="M0,334 H256 M40,322 v12 M110,322 v12 M180,322 v12" stroke="#b3acd0" stroke-width="2"/>`,
    ),
  'wands-03-three': () =>
    svg(
      bg('sunset') +
        sea(220, C.skyD) +
        ship(56, 248, 0.9) +
        ship(196, 256, 0.7) +
        ship(130, 236, 0.55) +
        `<path d="M0,372 L0,300 Q128,280 256,300 L256,372Z" fill="#c99a6e"/>` +
        wand(36, 372, 280) +
        wand(222, 372, 280) +
        wand(176, 372, 300) +
        jelly(118, 336, { s: 1.15, color: 'peach', face: 'back', arms: 'rout', acc: hat.cape(C.red) }),
    ),
  'wands-04-four': () =>
    svg(
      bg('gold') +
        castle(128, 250, 1.1) +
        hills(270, C.mint) +
        jelly(102, 300, { s: 0.6, color: 'pink', face: 'happy', arms: 'up' }) +
        jelly(154, 300, { s: 0.6, color: 'sky', face: 'happy', arms: 'up' }) +
        [36, 92, 164, 220].map((x) => wand(x, 372, 250)).join('') +
        `<path d="M36,132 Q64,170 92,132 M92,132 Q128,176 164,132 M164,132 Q192,170 220,132" stroke="${C.leaf}" stroke-width="9" fill="none"/>` +
        [64, 110, 146, 192].map((x, i) => `<circle cx="${x}" cy="${i % 3 ? 160 : 156}" r="7" fill="${i % 2 ? C.pink : C.gold}" stroke="${C.rose}" stroke-width="1.5"/>`).join(''),
    ),
  'wands-05-five': () =>
    svg(
      bg('day') +
        ground(300, C.mint, 10) +
        wand(40, 340, 250, 28) +
        wand(216, 340, 250, -28) +
        wand(90, 360, 250, 12) +
        wand(166, 360, 250, -12) +
        wand(128, 372, 240, 0) +
        jelly(52, 360, { s: 0.65, color: 'pink', face: 'determined', arms: 'up' }) +
        jelly(128, 368, { s: 0.65, color: 'sky', face: 'determined', arms: 'up' }) +
        jelly(204, 360, { s: 0.65, color: 'mint', face: 'determined', arms: 'up' }) +
        motion([
          [80, 100, -10, -8],
          [176, 100, 10, -8],
          [128, 70, 0, -12],
        ], C.goldD),
    ),
  'wands-06-six': () =>
    svg(
      bg('day') +
        ground(320, C.mint, 6) +
        [24, 56, 200, 232, 88].map((x, i) => wand(x, 372, 120 + (i % 2) * 20)).join('') +
        horse(108, 290, { s: 0.92, color: '#fff' }) +
        `<path d="M70,250 Q60,300 96,316 L120,316 Q120,270 70,250Z" fill="${C.mint}"/>` +
        jelly(100, 272, { s: 0.62, color: 'peach', face: 'happy', arms: 'rup', acc: hat.wreath() }) +
        wand(136, 250, 190, 6) +
        `<circle cx="156" cy="66" r="16" fill="none" stroke="${C.leaf}" stroke-width="7"/>`,
    ),
  'wands-07-seven': () =>
    svg(
      bg('day') +
        `<path d="M0,372 L0,290 Q128,200 256,290 L256,372Z" fill="${C.mint}"/>` +
        jelly(128, 234, { s: 1, color: 'peach', face: 'determined', arms: 'out' }) +
        wand(56, 230, 170, 60, 0.9) +
        [26, 70, 112, 150, 192, 232].map((x, i) => wand(x, 380, 110 + (i % 2) * 14, (128 - x) * 0.12, 0.9)).join(''),
    ),
  'wands-08-eight': () =>
    svg(
      bg('day') +
        hills(300, C.mint) +
        `<path d="M40,372 Q90,330 70,300 Q60,284 100,270" stroke="${C.skyD}" stroke-width="12" fill="none"/>` +
        castle(196, 290, 0.6) +
        Array.from({ length: 8 }, (_, i) => wand(4 + i * 7, 40 + i * 24, 230, 118, 0.85)).join(''),
    ),
  'wands-09-nine': () =>
    svg(
      bg('day') +
        ground(320, C.mint, 0) +
        [20, 46, 72, 98, 158, 184, 210, 236].map((x) => wand(x, 330, 250)).join('') +
        wand(176, 372, 250, -6) +
        jelly(118, 360, { s: 1.15, color: 'peach', face: 'worried', arms: 'rout', acc: hat.bandage() }),
    ),
  'wands-10-ten': () =>
    svg(
      bg('gold') +
        ground(330, C.mint, 6) +
        house(220, 320, 0.9) +
        Array.from({ length: 10 }, (_, i) => wand(70 + i * 7, 352 - i, 230, 14 + i * 1.6, 0.85)).join('') +
        jelly(110, 346, { s: 1.05, color: 'peach', face: 'sad', arms: 'front', rot: 10 }),
    ),
  'wands-11-page': () =>
    svg(bg('gold') + pyramids(270) + ground(270, '#ffe2a8', 0) + wand(176, 360, 270) + jelly(104, 340, { s: 1.15, color: 'peach', face: 'surprised', arms: 'rout', acc: hat.feather(C.orange) })),
  'wands-12-knight': () =>
    svg(
      bg('gold') +
        pyramids(300) +
        ground(300, '#ffe2a8', 0) +
        horse(120, 290, { s: 0.92, color: '#ffb89a', mane: C.orange, rear: true }) +
        jelly(104, 248, { s: 0.6, color: 'peach', face: 'determined', arms: 'rout', acc: hat.helmet(C.orange) }) +
        wand(158, 236, 170, 12),
    ),
  'wands-13-queen': () =>
    svg(
      bg('gold') +
        `<rect x="40" y="110" width="176" height="220" rx="20" fill="#f5d27a"/>` +
        ground(330, '#f5d27a', 0) +
        wand(206, 330, 250) +
        jelly(128, 320, { s: 1.15, color: 'peach', face: 'smile', arms: 'out', acc: hat.tiara() }) +
        sunflower(56, 230, 1.3) +
        blackCat(128, 372, 1.05),
    ),
  'wands-14-king': () =>
    svg(
      bg('red') +
        `<rect x="40" y="100" width="176" height="230" rx="20" fill="#e3a08c"/>` +
        lizard(70, 140, 0.8) +
        lizard(186, 140, 0.8) +
        ground(330, '#e3a08c', 0) +
        wand(204, 332, 260) +
        jelly(124, 326, { s: 1.2, color: 'peach', face: 'determined', arms: 'out', under: hat.cape(C.red), acc: hat.crown() }) +
        lizard(70, 356, 1),
    ),
}

// ---------- 컵 ----------
const cups = {
  'cups-02-two': () =>
    svg(
      bg('soft') +
        hills(300, C.mint) +
        house(128, 290, 0.7) +
        wing(110, 110, 0.6) +
        wing(146, 110, 0.6, true) +
        heart(128, 110, 1.3) +
        jelly(66, 340, { s: 1.05, color: 'pink', face: 'happy', arms: 'rout' }) +
        jelly(190, 340, { s: 1.05, color: 'sky', face: 'happy', arms: 'lout' }) +
        cup(112, 296, 0.8, { rot: 12 }) +
        cup(144, 296, 0.8, { rot: -12 }),
    ),
  'cups-03-three': () =>
    svg(
      bg('soft') +
        ground(320, C.mint, 6) +
        [
          [60, 'pink'],
          [128, 'lilac'],
          [196, 'mint'],
        ]
          .map(([x, c], i) => jelly(x, 336 - (i === 1 ? 10 : 0), { s: 0.82, color: c, face: 'happy', arms: 'up', acc: hat.flowers() }) + cup(x, 336 - (i === 1 ? 10 : 0) - 84, 0.72))
          .join('') +
        `<circle cx="40" cy="356" r="12" fill="${C.orange}"/><circle cx="214" cy="358" r="10" fill="#8d7fd1"/><circle cx="226" cy="352" r="8" fill="#8d7fd1"/>`,
    ),
  'cups-04-four': () =>
    svg(
      bg('mint') +
        ground(320, C.mint, 6) +
        tree(204, 320, 1.4) +
        jelly(176, 346, { s: 1.05, color: 'peach', face: 'worried', arms: 'cross' }) +
        cup(36, 366, 0.62) +
        cup(78, 368, 0.62) +
        cup(120, 370, 0.62) +
        cup(70, 214, 0.75) +
        fistFromCloud(70, 200, -1, 0.9),
    ),
  'cups-05-five': () =>
    svg(
      bg('grey') +
        sea(250, '#8fb6dc') +
        `<path d="M150,250 Q190,214 230,250" stroke="#b3acd0" stroke-width="10" fill="none"/>` +
        castle(220, 236, 0.6, '#d6d1ea') +
        ground(310, '#b3acd0', 6) +
        jelly(96, 330, { s: 1.15, color: 'grey', face: 'sad', acc: hat.robe('#3a3070') + hat.hood('#3a3070') }) +
        cup(176, 336, 0.68) +
        cup(218, 340, 0.68) +
        `<ellipse cx="70" cy="346" rx="54" ry="9" fill="${C.lilacD}" opacity=".7"/>` +
        cup(40, 344, 0.62, { rot: -100, water: false, heart: false }) +
        cup(82, 350, 0.62, { rot: -80, water: false, heart: false }) +
        cup(124, 346, 0.62, { rot: -110, water: false, heart: false }),
    ),
  'cups-06-six': () => {
    const flowerCup = (x, y, s) => cup(x, y, s, { heart: false, water: false }) + [-8, 0, 8].map((dx) => `<circle cx="${x + dx * s * 1.4}" cy="${y - 62 * s}" r="${6 * s * 1.3}" fill="#fff" stroke="${C.lilac}" stroke-width="1.5"/>`).join('')
    return svg(
      bg('gold') +
        house(200, 250, 1) +
        ground(290, C.mint, 6) +
        jelly(86, 318, { s: 0.95, color: 'pink', face: 'happy', arms: 'rout', acc: hat.hood(C.red) }) +
        jelly(182, 318, { s: 0.72, color: 'sky', face: 'happy', arms: 'lout' }) +
        flowerCup(134, 282, 0.8) +
        [36, 82, 128, 174, 220].map((x) => flowerCup(x, 368, 0.55)).join(''),
    )
  },
  'cups-07-seven': () => {
    const items = [
      `<path d="M0,22 C-20,8 -16,-10 0,0 C16,-10 20,8 0,22Z" fill="${C.rose}" transform="scale(.6) translate(0,-90)"/>`,
      g(0, -40, `<path d="M-10,0 V-14 H10 V0Z M-12,-14 L0,-24 L12,-14Z" fill="${C.lilacD}"/>`),
      g(0, -44, `<path d="M0,-12 L10,0 L0,12 L-10,0Z" fill="${C.sky}" stroke="${C.skyD}" stroke-width="2"/>`),
      g(0, -44, `<circle r="10" fill="none" stroke="${C.leaf}" stroke-width="5"/>`),
      g(0, -44, `<path d="M-12,6 q6,-14 12,0 q6,14 12,0" stroke="${C.mintD}" stroke-width="5" fill="none" stroke-linecap="round"/>`),
      g(0, -44, `<circle r="10" fill="${C.pink}"/><circle cx="-3" cy="-2" r="1.6" fill="${C.ink}"/><circle cx="3" cy="-2" r="1.6" fill="${C.ink}"/>`),
      g(0, -44, `<use href="#s8" transform="scale(1.1)" fill="${C.gold}"/>`),
    ]
    const pos = [
      [44, 120],
      [100, 120],
      [156, 120],
      [212, 120],
      [72, 218],
      [128, 218],
      [184, 218],
    ]
    return svg(
      bg('lilac') +
        pos.map(([x, y], i) => cloud(x, y + 6, 0.62) + cup(x, y, 0.58, { heart: false }) + g(x, y - 34, items[i])).join('') +
        jelly(128, 400, { s: 1.4, color: 'dark', face: 'back' }),
    )
  },
  'cups-08-eight': () =>
    svg(
      bg('night') +
        `<circle cx="196" cy="74" r="28" fill="#fff7d1"/><path d="M196,46 A28,28 0 0,1 196,102 A20,28 0 0,0 196,46Z" fill="${C.gold}"/>` +
        mountains(250, '#4b3f86') +
        ground(300, '#3a3070', 8) +
        `<path d="M196,260 L192,182" stroke="${C.brown}" stroke-width="4" stroke-linecap="round"/>` +
        jelly(176, 262, { s: 0.75, color: 'peach', face: 'back', acc: hat.cape(C.red) }) +
        [24, 58, 92, 126, 160].map((x) => cup(x, 368, 0.52, { heart: false })).join('') +
        [41, 75, 109].map((x) => cup(x, 334, 0.52, { heart: false })).join(''),
    ),
  'cups-09-nine': () =>
    svg(
      bg('soft') +
        `<path d="M10,214 Q128,150 246,214 L246,236 Q128,172 10,236Z" fill="${C.sky}"/>` +
        Array.from({ length: 9 }, (_, i) => {
          const p = i / 8
          return cup(24 + p * 208, 214 - 52 * Math.sin(Math.PI * p) + 4, 0.55)
        }).join('') +
        `<rect x="40" y="300" width="176" height="18" rx="6" fill="${C.brown}"/>` +
        jelly(128, 340, { s: 1.3, color: 'peach', face: 'smug', arms: 'cross', acc: `<path d="M-30,-78 Q0,-104 30,-78Z" fill="${C.red}"/>` }),
    ),
  'cups-10-ten': () =>
    svg(
      bg('soft') +
        rainbow(128, 210, 118) +
        Array.from({ length: 10 }, (_, i) => {
          const a = Math.PI - (i / 9) * Math.PI
          return cup(128 + Math.cos(a) * 100, 210 - Math.sin(a) * 100 + 14, 0.42, { heart: false })
        }).join('') +
        hills(280, C.mint) +
        house(214, 262, 0.7) +
        jelly(62, 342, { s: 0.78, color: 'pink', face: 'happy', arms: 'up' }) +
        jelly(118, 342, { s: 0.8, color: 'sky', face: 'happy', arms: 'up' }) +
        jelly(172, 356, { s: 0.45, color: 'mint', face: 'happy', arms: 'up' }) +
        jelly(214, 356, { s: 0.45, color: 'gold', face: 'happy', arms: 'up' }),
    ),
  'cups-11-page': () =>
    svg(
      bg('soft') +
        sea(270, C.skyD) +
        jelly(98, 346, { s: 1.15, color: 'pink', face: 'surprised', arms: 'rout', acc: hat.feather(C.sky) }) +
        cup(180, 300, 1.1, { heart: false }) +
        fish(176, 214, 1.1, -60),
    ),
  'cups-12-knight': () =>
    svg(
      bg('soft') +
        hills(290, C.mint) +
        `<path d="M0,330 Q128,310 256,330 L256,346 Q128,326 0,346Z" fill="${C.skyD}"/>` +
        horse(106, 300, { s: 0.92, color: '#fff' }) +
        jelly(96, 282, { s: 0.6, color: 'sky', face: 'calm', arms: 'rout', acc: hat.wingHelm() }) +
        cup(196, 236, 0.8),
    ),
  'cups-13-queen': () =>
    svg(
      bg('soft') +
        sea(250, C.skyD) +
        `<rect x="22" y="130" width="130" height="200" rx="20" fill="${C.lilac}"/>` +
        ground(330, '#d9cffb', 0) +
        jelly(96, 330, { s: 1.15, color: 'sky', face: 'calm', arms: 'rout', under: hat.veil(C.lilac), acc: hat.tiara() }) +
        cup(186, 322, 1.15, { lid: true, heart: true }),
    ),
  'cups-14-king': () =>
    svg(
      bg('soft') +
        sea(230, C.skyD) +
        ship(212, 226, 0.8) +
        fish(44, 230, 1, -30) +
        `<rect x="56" y="300" width="144" height="50" rx="6" fill="#b3acd0"/>` +
        `<rect x="66" y="150" width="124" height="160" rx="16" fill="#d6d1ea"/>` +
        jelly(128, 306, { s: 1.1, color: 'sky', face: 'calm', arms: 'out', under: hat.cape(C.skyD), acc: hat.crown() }) +
        cup(178, 286, 0.8) +
        `<path d="M0,350 Q32,340 64,350 T128,350 T192,350 T256,350 L256,372 L0,372Z" fill="${C.skyD}"/>`,
    ),
}

// ---------- 소드 ----------
const swords = {
  'swords-01-ace': () =>
    svg(
      bg('grey') +
        mountains(320, '#d6d1ea') +
        sword(104, 300, 240, 0, 1.05) +
        fistFromCloud(104, 310, 1, 1) +
        g(104, 70, `<path d="M-22,8 L-24,-14 L-12,-4 L0,-20 L12,-4 L24,-14 L22,8Z" fill="${C.gold}" stroke="${C.goldD}" stroke-width="2.5" stroke-linejoin="round"/>`) +
        `<path d="M84,78 q-20,14 -14,40 M124,78 q20,14 14,40" stroke="${C.leaf}" stroke-width="5" fill="none" stroke-linecap="round"/>`,
    ),
  'swords-02-two': () =>
    svg(
      bg('night') +
        moonCrescent(206, 66, 22, 20) +
        sea(250, '#4b5fa0') +
        `<path d="M200,262 l20,-14 l20,14Z" fill="#8f89ad"/>` +
        `<rect x="76" y="320" width="104" height="52" rx="6" fill="#b3acd0"/>` +
        jelly(128, 330, { s: 1.15, color: 'white', face: 'blind', arms: 'cross' }) +
        sword(116, 298, 210, 38, 1) +
        sword(140, 298, 210, -38, 1),
    ),
  'swords-03-three': () =>
    svg(
      bg('storm') +
        cloud(56, 74, 1.1, '#6e60b8') +
        cloud(200, 66, 1.2, '#6e60b8') +
        rain([[40, 110], [70, 130], [190, 110], [220, 128], [120, 300], [30, 300], [220, 300], [60, 340], [200, 340]]) +
        heart(128, 210, 3.1, C.rose) +
        stuckSword(128, 300, 240, 0, 0.9) +
        stuckSword(146, 290, 230, 26, 0.9) +
        stuckSword(110, 290, 230, -26, 0.9),
    ),
  'swords-04-four': () =>
    svg(
      bg('lilac') +
        `<path d="M24,40 h56 v70 h-56Z" fill="${C.gold}" opacity=".6"/><path d="M52,40 v70 M24,74 h56" stroke="#fff" stroke-width="3"/>` +
        stuckSword(110, 210, 140, 0, 0.75) +
        stuckSword(150, 210, 140, 0, 0.75) +
        stuckSword(190, 210, 140, 0, 0.75) +
        `<rect x="20" y="276" width="216" height="70" rx="8" fill="#b3acd0"/><rect x="20" y="276" width="216" height="14" rx="6" fill="#d6d1ea"/>` +
        jelly(178, 236, { s: 0.95, rot: -90, color: 'sky', face: 'sleep', arms: 'cross' }) +
        sword(46, 326, 170, 90, 0.75),
    ),
  'swords-05-five': () =>
    svg(
      bg('grey') +
        cloud(70, 70, 1, '#d6d1ea') +
        sea(250, '#8fb6dc') +
        jelly(196, 262, { s: 0.42, color: 'grey', face: 'back' }) +
        jelly(232, 270, { s: 0.38, color: 'lilac', face: 'back' }) +
        ground(290, '#b3acd0', 6) +
        sword(162, 300, 170, 15, 0.9) +
        sword(70, 284, 160, -22, 0.85) +
        sword(56, 294, 160, -36, 0.85) +
        jelly(112, 340, { s: 1.1, color: 'peach', face: 'smug', arms: 'out' }) +
        sword(176, 358, 120, 96, 0.75) +
        sword(186, 344, 120, 76, 0.75),
    ),
  'swords-06-six': () =>
    svg(
      bg('grey') +
        sea(236, '#8fb6dc') +
        hills(250, '#b3acd0') +
        `<path d="M0,280 Q128,268 256,280 L256,372 L0,372Z" fill="#8fb6dc"/>` +
        jelly(100, 286, { s: 0.6, color: 'grey', face: 'back', acc: hat.hood('#8f89ad') }) +
        jelly(138, 288, { s: 0.38, color: 'lilac', face: 'back' }) +
        jelly(196, 286, { s: 0.62, color: 'peach', face: 'calm' }) +
        `<path d="M222,180 L172,372" stroke="${C.brownD}" stroke-width="5" stroke-linecap="round"/>` +
        [64, 88, 112, 136, 160, 184].map((x) => sword(x, 310, 120, 0, 0.75)).join('') +
        `<path d="M24,300 L232,300 L206,340 L50,340Z" fill="${C.brown}"/><path d="M30,306 H226" stroke="#c99a6e" stroke-width="4"/>`,
    ),
  'swords-07-seven': () =>
    svg(
      bg('gold') +
        tents(46, 250) +
        tents(96, 240) +
        ground(260, C.mint, 0) +
        stuckSword(34, 330, 140, -6, 0.75) +
        stuckSword(64, 336, 140, 6, 0.75) +
        jelly(150, 346, { s: 1.05, color: 'peach', face: 'smug', rot: 10, flip: true, arms: 'out' }) +
        Array.from({ length: 5 }, (_, i) => sword(110 + i * 8, 300 + i * 2, 150, 64 + i * 4, 0.8)).join('') +
        motion([
          [200, 362, 14, 0],
          [204, 350, 14, 0],
        ], C.navy),
    ),
  'swords-08-eight': () =>
    svg(
      bg('grey') +
        castle(214, 200, 0.7, '#d6d1ea') +
        ground(320, '#b3acd0', 0) +
        [16, 38, 60, 196, 218, 240].map((x, i) => stuckSword(x, 340 - (i % 2) * 6, 160, 0, 0.75)).join('') +
        stuckSword(82, 330, 120, 0, 0.7) +
        stuckSword(174, 330, 120, 0, 0.7) +
        jelly(128, 340, { s: 1.1, color: 'white', face: 'blind', acc: `<path d="M-44,-20 Q0,-10 44,-20 M-44,-34 Q0,-24 44,-34" stroke="${C.red}" stroke-width="5" fill="none"/>` }),
    ),
  'swords-09-nine': () =>
    svg(
      bg('storm') +
        Array.from({ length: 9 }, (_, i) => sword(36, 46 + i * 22, 220, 90, 0.75)).join('') +
        jelly(128, 316, {
          s: 1.05,
          color: 'lilac',
          face: 'cry',
          arms: [
            [-20, -46, -60],
            [20, -46, 60],
          ],
        }) +
        `<rect x="18" y="300" width="220" height="44" rx="8" fill="#fff"/>` +
        [36, 76, 116, 156, 196].map((x, i) => `<rect x="${x}" y="${i % 2 ? 314 : 306}" width="22" height="22" rx="4" fill="${i % 2 ? C.pink : C.sky}"/>`).join('') +
        `<path d="M24,344 v28 M232,344 v28" stroke="${C.brown}" stroke-width="10"/>`,
    ),
  'swords-10-ten': () =>
    svg(
      bg('storm') +
        `<rect x="0" y="262" width="256" height="40" fill="${C.gold}" opacity=".55"/>` +
        ground(300, '#2c2652', 0) +
        jelly(36, 300, { s: 1.35, rot: 90, color: 'grey', face: 'dizzy' }) +
        Array.from({ length: 10 }, (_, i) => stuckSword(52 + i * 10, 254 - Math.sin((i / 9) * Math.PI) * 6, 130, -36 + i * 8, 0.62)).join(''),
    ),
  'swords-11-page': () =>
    svg(
      bg('grey') +
        cloud(60, 80, 1, '#fff') +
        cloud(200, 110, 0.8, '#fff') +
        birds([[150, 60], [176, 74], [126, 84]]) +
        ground(320, C.mint, 14) +
        sword(176, 280, 220, 12, 1) +
        jelly(104, 336, { s: 1.15, color: 'peach', face: 'determined', arms: 'rup' }),
    ),
  'swords-12-knight': () =>
    svg(
      bg('grey') +
        cloud(200, 70, 1, '#fff') +
        motion([
          [20, 120, 30, 0],
          [10, 160, 40, 0],
          [24, 200, 30, 0],
        ], '#fff') +
        ground(320, '#b3acd0', 0) +
        horse(116, 290, { s: 0.92, color: '#fff', rear: true }) +
        jelly(100, 248, { s: 0.6, color: 'sky', face: 'determined', arms: 'rout', acc: hat.helmet(C.red) }) +
        sword(150, 210, 170, 50, 0.9),
    ),
  'swords-13-queen': () =>
    svg(
      bg('soft') +
        cloud(200, 280, 1.2, '#fff') +
        `<rect x="30" y="140" width="110" height="190" rx="16" fill="#d6d1ea"/>` +
        butterfly(58, 160, 1.1) +
        butterfly(112, 170, 0.9) +
        ground(330, '#b3acd0', 0) +
        sword(186, 300, 250, 0, 1) +
        jelly(98, 330, { s: 1.15, color: 'lilac', face: 'calm', arms: 'rout', acc: hat.tiara() }),
    ),
  'swords-14-king': () =>
    svg(
      bg('grey') +
        `<rect x="44" y="110" width="168" height="220" rx="16" fill="#d6d1ea"/>` +
        butterfly(80, 132, 1) +
        butterfly(176, 132, 1) +
        ground(330, '#b3acd0', 0) +
        sword(196, 312, 250, -6, 1) +
        jelly(124, 330, { s: 1.2, color: 'sky', face: 'determined', arms: 'out', under: hat.cape(C.lilacD), acc: hat.crown() }),
    ),
}

// ---------- 펜타클 ----------
const pentacles = {
  'pentacles-01-ace': () =>
    svg(
      bg('mint') +
        `<path d="M58,372 L58,310 Q128,236 198,310 L198,372" stroke="${C.mintD}" stroke-width="18" fill="none"/>` +
        [
          [62, 300],
          [86, 268],
          [128, 254],
          [170, 268],
          [194, 300],
        ]
          .map(([x, y]) => rose(x, y, 0.7, C.pink))
          .join('') +
        pentacle(122, 150, 68) +
        palmHand(126, 240),
    ),
  'pentacles-02-two': () =>
    svg(
      bg('soft') +
        `<path d="M0,250 Q40,214 80,250 T160,250 T256,240 L256,372 L0,372Z" fill="${C.skyD}"/>` +
        ship(50, 236, 0.9) +
        ship(206, 230, 0.8) +
        `<path d="M128,170 C100,116 46,116 46,170 C46,224 100,224 128,170 C156,116 210,116 210,170 C210,224 156,224 128,170Z" stroke="${C.leaf}" stroke-width="7" fill="none"/>` +
        pentacle(62, 170, 28) +
        pentacle(194, 170, 28) +
        jelly(128, 352, { s: 1.05, color: 'peach', face: 'happy', arms: 'out', rot: -6, acc: `<path d="M-14,-80 L0,-124 L14,-80Z" fill="${C.red}"/>` }),
    ),
  'pentacles-03-three': () =>
    svg(
      bg('lilac') +
        `<path d="M24,372 L24,140 Q128,30 232,140 L232,372 L196,372 L196,150 Q128,80 60,150 L60,372Z" fill="#c9c3dd"/>` +
        pentacle(98, 150, 22) +
        pentacle(158, 150, 22) +
        pentacle(128, 198, 22) +
        `<rect x="76" y="320" width="104" height="16" rx="5" fill="${C.brown}"/><path d="M86,336 v36 M170,336 v36" stroke="${C.brownD}" stroke-width="7"/>` +
        jelly(128, 320, { s: 0.85, color: 'peach', face: 'determined', arms: 'rup' }) +
        `<path d="M168,256 L186,232" stroke="${C.brownD}" stroke-width="5" stroke-linecap="round"/><rect x="178" y="220" width="20" height="12" rx="3" fill="${C.greyD}" transform="rotate(-37 188 226)"/>`,
    ),
  'pentacles-04-four': () =>
    svg(
      bg('grey') +
        `<path d="M0,280 V220 H30 V190 H60 V230 H96 V200 H130 V236 H166 V180 H200 V226 H232 V206 H256 V280Z" fill="#d6d1ea"/>` +
        ground(320, '#b3acd0', 0) +
        jelly(128, 320, { s: 1.15, color: 'peach', face: 'smug', arms: 'front', acc: hat.crown() }) +
        pentacle(128, 182, 20) +
        pentacle(128, 302, 26) +
        pentacle(82, 344, 22) +
        pentacle(174, 344, 22),
    ),
  'pentacles-05-five': () => {
    const snow = Array.from({ length: 26 }, (_, i) => [(i * 53) % 256, 30 + ((i * 97) % 300)])
    return svg(
      bg('night') +
        `<path d="M58,210 L58,90 Q128,10 198,90 L198,210Z" fill="${C.gold}" stroke="#8d7fd1" stroke-width="8"/>` +
        [
          [104, 92],
          [152, 92],
          [128, 128],
          [104, 164],
          [152, 164],
        ]
          .map(([x, y]) => pentacle(x, y, 16))
          .join('') +
        ground(320, '#fff', 0) +
        `<path d="M108,370 L120,280" stroke="${C.brown}" stroke-width="5" stroke-linecap="round"/>` +
        jelly(78, 344, { s: 0.85, color: 'grey', face: 'sad', acc: hat.bandage() }) +
        jelly(176, 344, { s: 0.9, color: 'lilac', face: 'cry', acc: hat.hood('#8f89ad') }) +
        dots(snow, '#fff', 2.2, 0.8),
    )
  },
  'pentacles-06-six': () =>
    svg(
      bg('gold') +
        coinsArc(6, 70, 20, 16, 28, 228) +
        ground(330, '#f5d27a', 0) +
        jelly(128, 316, { s: 1.05, color: 'peach', face: 'calm', arms: 'lup', acc: hat.robe(C.red) + `<path d="M-30,-78 Q0,-104 30,-78Z" fill="${C.red}"/>` }) +
        scales(80, 210, 0.85) +
        [
          [176, 266],
          [184, 286],
          [176, 306],
        ]
          .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="${C.gold}" stroke="${C.goldD}" stroke-width="2"/>`)
          .join('') +
        jelly(40, 362, { s: 0.55, color: 'grey', face: 'worried', arms: 'up' }) +
        jelly(214, 362, { s: 0.55, color: 'lilac', face: 'worried', arms: 'up' }),
    ),
  'pentacles-07-seven': () =>
    svg(
      bg('mint') +
        ground(320, C.mintD, 6) +
        `<g fill="${C.leaf}"><circle cx="176" cy="220" r="64"/><circle cx="134" cy="262" r="40"/><circle cx="218" cy="270" r="40"/><circle cx="176" cy="290" r="44"/></g>` +
        [
          [150, 180],
          [200, 178],
          [176, 222],
          [132, 254],
          [222, 256],
          [160, 296],
          [196, 300],
        ]
          .map(([x, y]) => pentacle(x, y, 16))
          .join('') +
        `<path d="M98,372 L80,214" stroke="${C.brown}" stroke-width="6" stroke-linecap="round"/><path d="M70,214 L96,206" stroke="${C.greyD}" stroke-width="8" stroke-linecap="round"/>` +
        jelly(60, 352, { s: 0.95, color: 'peach', face: 'calm', arms: 'rout', rot: -6 }),
    ),
  'pentacles-08-eight': () =>
    svg(
      bg('soft') +
        `<path d="M216,372 V40" stroke="${C.brown}" stroke-width="12"/>` +
        [64, 110, 156, 202, 248].map((y) => pentacle(216, y, 18)).join('') +
        pentacle(216, 294, 18) +
        ground(330, '#d9cffb', 0) +
        `<rect x="40" y="306" width="130" height="16" rx="5" fill="${C.brown}"/><path d="M50,322 v50 M160,322 v50" stroke="${C.brownD}" stroke-width="7"/>` +
        jelly(92, 306, { s: 0.95, color: 'peach', face: 'determined', arms: 'rup' }) +
        `<path d="M138,240 L150,214" stroke="${C.brownD}" stroke-width="5" stroke-linecap="round"/><rect x="140" y="202" width="22" height="12" rx="3" fill="${C.greyD}" transform="rotate(-25 151 208)"/>` +
        pentacle(146, 292, 16) +
        pentacle(30, 350, 16),
    ),
  'pentacles-09-nine': () =>
    svg(
      bg('gold') +
        `<g fill="${C.leaf}"><ellipse cx="22" cy="240" rx="34" ry="130"/><ellipse cx="234" cy="240" rx="34" ry="130"/></g>` +
        [
          [36, 140],
          [24, 196],
          [36, 252],
          [24, 308],
          [220, 140],
          [232, 196],
          [220, 252],
          [232, 308],
          [64, 340],
        ]
          .map(([x, y]) => pentacle(x, y, 16))
          .join('') +
        [
          [52, 170],
          [204, 226],
        ]
          .map(([x, y]) => `<g fill="#8d7fd1"><circle cx="${x}" cy="${y}" r="5"/><circle cx="${x + 8}" cy="${y}" r="5"/><circle cx="${x + 4}" cy="${y + 8}" r="5"/></g>`)
          .join('') +
        ground(330, C.mint, 0) +
        jelly(118, 336, { s: 1.15, color: 'peach', face: 'calm', arms: 'rup', acc: hat.robe(C.gold) + hat.flowers() }) +
        falcon(176, 244, 1.1),
    ),
  'pentacles-10-ten': () =>
    svg(
      bg('mint') +
        `<path d="M70,372 V250 Q128,200 186,250 V372" fill="none" stroke="#c9c3dd" stroke-width="14"/>` +
        [
          [128, 44],
          [82, 76],
          [174, 76],
          [82, 134],
          [174, 134],
          [128, 162],
          [82, 194],
          [174, 194],
          [128, 222],
          [128, 280],
        ]
          .map(([x, y]) => pentacle(x, y, 16))
          .join('') +
        ground(330, C.mintD, 0) +
        jelly(40, 352, { s: 0.6, color: 'white', face: 'calm', acc: hat.beard() }) +
        dog(84, 360, { s: 0.75 }) +
        jelly(172, 352, { s: 0.58, color: 'pink', face: 'happy' }) +
        jelly(216, 352, { s: 0.58, color: 'sky', face: 'happy' }) +
        jelly(130, 360, { s: 0.36, color: 'gold', face: 'happy' }),
    ),
  'pentacles-11-page': () =>
    svg(
      bg('mint') +
        ground(320, C.mint, 10) +
        [30, 62, 194, 226].map((x, i) => flower(x, 360, 1, i % 2 ? C.pink : '#fff')).join('') +
        jelly(128, 346, { s: 1.15, color: 'peach', face: 'surprised', arms: 'up', acc: `<path d="M-30,-78 Q0,-104 30,-78Z" fill="${C.red}"/>` }) +
        pentacle(128, 178, 40),
    ),
  'pentacles-12-knight': () =>
    svg(
      bg('gold') +
        `<path d="M0,290 H256 V372 H0Z" fill="#c99a6e"/>` +
        [304, 322, 342, 362].map((y) => `<path d="M0,${y} H256" stroke="${C.brown}" stroke-width="3"/>`).join('') +
        horse(110, 290, { s: 0.92, color: '#4b3f86', mane: C.navy }) +
        jelly(100, 272, { s: 0.62, color: 'peach', face: 'calm', arms: 'rout', acc: hat.helmet(C.leaf) }) +
        pentacle(188, 206, 24),
    ),
  'pentacles-13-queen': () =>
    svg(
      bg('mint') +
        [20, 60, 100, 140, 180, 220].map((x, i) => rose(x + 8, 40 + (i % 2) * 14, 0.8, C.pink)).join('') +
        `<path d="M0,40 Q128,80 256,40" stroke="${C.leaf}" stroke-width="6" fill="none"/>` +
        `<rect x="56" y="130" width="144" height="200" rx="16" fill="#d6d1ea"/>` +
        ground(330, C.mint, 0) +
        jelly(128, 330, { s: 1.15, color: 'peach', face: 'calm', arms: 'front', under: hat.veil(C.mint), acc: hat.tiara() }) +
        pentacle(128, 318, 24) +
        rabbit(214, 364, 1),
    ),
  'pentacles-14-king': () =>
    svg(
      bg('gold') +
        castle(40, 160, 1, '#d6d1ea') +
        `<rect x="50" y="110" width="156" height="220" rx="16" fill="#c9c3dd"/>` +
        bull(70, 126, 1.1) +
        bull(186, 126, 1.1) +
        ground(330, C.mint, 0) +
        jelly(128, 330, {
          s: 1.2,
          color: 'purple',
          face: 'calm',
          arms: 'out',
          acc: hat.crown() + [[-24, -20], [0, -12], [24, -20], [-12, -28], [12, -28]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#ffc7e3" opacity=".7"/>`).join(''),
        }) +
        pentacle(178, 290, 26) +
        `<path d="M70,300 L64,214" stroke="${C.goldD}" stroke-width="5" stroke-linecap="round"/><circle cx="64" cy="210" r="8" fill="${C.gold}" stroke="${C.goldD}" stroke-width="2"/>`,
    ),
}

export const minors = { ...wands, ...cups, ...swords, ...pentacles }
