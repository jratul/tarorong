// 메이저 아르카나 장면. 바보(0)·탑(16)·별(17)은 handmade/ 원본을 쓴다.
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
  sunRays,
  moonCrescent,
  star,
  spark,
  dots,
  cloud,
  jelly,
  hat,
  wand,
  cup,
  sword,
  pentacle,
  heart,
  horse,
  dog,
  lion,
  tree,
  castle,
  flower,
  sunflower,
  wheat,
  pillar,
  throne,
  banner,
  scales,
  lantern,
  key,
  wing,
  chain,
} from './lib.mjs'

const batWing = (x, y, flip) =>
  g(
    x,
    y,
    `<path d="M0,0 Q-30,-64 -86,-54 Q-70,-38 -76,-20 Q-58,-28 -58,-8 Q-42,-18 -38,4Z" fill="#3a3070" stroke="#6e60b8" stroke-width="2" stroke-linejoin="round"/>`,
    { flip },
  )

const roseBadge = (x, y, r = 12) =>
  [0, 1, 2, 3, 4]
    .map((i) => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5
      return `<circle cx="${(x + Math.cos(a) * r * 0.6).toFixed(1)}" cy="${(y + Math.sin(a) * r * 0.6).toFixed(1)}" r="${r * 0.55}" fill="#fff"/>`
    })
    .join('') + `<circle cx="${x}" cy="${y}" r="${r * 0.35}" fill="${C.gold}"/>`

export const majors = {
  'major-01-magician': () =>
    svg(
      bg('gold') +
        dots(
          [
            [30, 60],
            [220, 50],
            [40, 160],
            [226, 150],
          ],
          C.goldD,
          2,
          0.4,
        ) +
        wand(178, 214, 120, 8) +
        jelly(128, 286, {
          s: 1.15,
          color: 'white',
          face: 'determined',
          arms: 'rup',
          under: hat.cape(C.red),
          acc: hat.infinity(),
        }) +
        `<rect x="18" y="276" width="220" height="22" rx="6" fill="${C.brown}"/><rect x="18" y="272" width="220" height="10" rx="5" fill="#c99a6e"/><path d="M36,298 v74 M220,298 v74" stroke="${C.brownD}" stroke-width="8"/>` +
        cup(56, 274, 0.6, { heart: false }) +
        pentacle(102, 256, 15) +
        sword(150, 264, 80, 90, 0.7) +
        spark(46, 110, 1, C.goldD) +
        spark(214, 120, 0.8, C.goldD),
    ),

  'major-02-high-priestess': () =>
    svg(
      bg('night') +
        `<rect x="56" y="90" width="144" height="240" rx="6" fill="#5a4a9a"/>` +
        [
          [80, 130],
          [128, 116],
          [176, 130],
          [92, 190],
          [164, 190],
        ]
          .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="${C.red}" opacity=".85"/>`)
          .join('') +
        pillar(36, 336, 260, '#3a3070', 'B', '#fff') +
        pillar(220, 336, 260, '#fff', 'J', C.ink) +
        ground(336, '#3a3070', 0) +
        jelly(128, 326, {
          s: 1.15,
          color: 'lilac',
          face: 'calm',
          under: hat.veil('#9fd8ff'),
          acc:
            hat.robe(C.sky) +
            `<path d="M-20,-84 q-4,-22 10,-26 q-6,14 4,22Z M20,-84 q4,-22 -10,-26 q6,14 -4,22Z" fill="#fff"/><circle cx="0" cy="-96" r="9" fill="#fff"/>` +
            `<rect x="-14" y="-30" width="28" height="18" rx="5" fill="${C.cream}" stroke="${C.creamD}" stroke-width="2"/>`,
        }) +
        moonCrescent(128, 350, 18, -90),
    ),

  'major-03-empress': () =>
    svg(
      bg('gold') +
        hills(270, C.mint) +
        tree(214, 250, 0.9) +
        `<ellipse cx="128" cy="300" rx="78" ry="20" fill="${C.rose}"/>` +
        jelly(128, 296, { s: 1.2, color: 'pink', face: 'calm', arms: 'rout', acc: hat.starCrown() }) +
        `<path d="M196,250 L196,180" stroke="${C.goldD}" stroke-width="5" stroke-linecap="round"/><circle cx="196" cy="174" r="9" fill="${C.gold}" stroke="${C.goldD}" stroke-width="2.5"/>` +
        heart(50, 262, 1.25, C.rose) +
        `<circle cx="50" cy="258" r="9" fill="none" stroke="${C.goldD}" stroke-width="3"/><path d="M50,267 v12 M44,274 h12" stroke="${C.goldD}" stroke-width="3" stroke-linecap="round"/>` +
        [16, 44, 72, 100, 128, 156, 184, 212, 240].map((x, i) => wheat(x, 372, 1.25 + (i % 2) * 0.15)).join(''),
    ),

  'major-04-emperor': () =>
    svg(
      bg('red') +
        mountains(250, '#e3a08c') +
        ground(320, '#b3acd0', 0) +
        throne(128, 330, 160, 220, '#b3acd0') +
        [56, 200]
          .map(
            (x) =>
              `<circle cx="${x}" cy="128" r="15" fill="#d6d1ea" stroke="#8f89ad" stroke-width="2"/><path d="M${x - 6},120 q-16,-6 -14,10 q2,8 9,4" stroke="${C.goldD}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M${x + 6},120 q16,-6 14,10 q-2,8 -9,4" stroke="${C.goldD}" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="${x - 5}" cy="128" r="2" fill="${C.ink}"/><circle cx="${x + 5}" cy="128" r="2" fill="${C.ink}"/>`,
          )
          .join('') +
        jelly(128, 326, {
          s: 1.25,
          color: 'peach',
          face: 'determined',
          arms: 'out',
          under: hat.cape(C.red),
          acc: hat.beard() + hat.crown(),
        }) +
        `<circle cx="196" cy="234" r="10" fill="none" stroke="${C.goldD}" stroke-width="5"/><path d="M196,244 V290 M184,252 H208" stroke="${C.goldD}" stroke-width="5" stroke-linecap="round"/>` +
        `<circle cx="60" cy="262" r="12" fill="${C.gold}" stroke="${C.goldD}" stroke-width="2.5"/><path d="M60,250 v-8 M55,246 h10" stroke="${C.goldD}" stroke-width="2.5"/>`,
    ),

  'major-05-hierophant': () =>
    svg(
      bg('lilac') +
        pillar(40, 336, 250, '#b3acd0') +
        pillar(216, 336, 250, '#b3acd0') +
        ground(336, '#c9b8ff', 0) +
        `<path d="M70,300 L70,150" stroke="${C.goldD}" stroke-width="5" stroke-linecap="round"/><path d="M58,160 h24 M61,172 h18 M64,184 h12" stroke="${C.goldD}" stroke-width="4" stroke-linecap="round"/>` +
        jelly(128, 300, { s: 1.15, color: 'white', face: 'calm', arms: 'rup', acc: hat.robe(C.red) + hat.triple() }) +
        key(108, 338, -35, 1.05) +
        key(148, 338, 35, 1.05),
    ),

  'major-06-lovers': () =>
    svg(
      bg('day') +
        sun(128, 70, 28, false) +
        `<path d="M96,372 L128,262 L160,372Z" fill="${C.lilac}"/>` +
        ground(330, C.mint, 10) +
        wing(108, 146, 0.95) +
        wing(148, 146, 0.95, true) +
        cloud(128, 186, 1.4) +
        jelly(128, 178, {
          s: 0.75,
          color: 'lilac',
          face: 'calm',
          arms: 'out',
          acc: `<path d="M-22,-80 q0,-20 10,-22 q2,10 8,6 q4,-12 14,-6 q8,-6 12,6Z" fill="${C.orange}"/>`,
        }) +
        jelly(62, 344, { s: 0.95, color: 'pink', face: 'happy', arms: 'rout' }) +
        jelly(194, 344, { s: 0.95, color: 'sky', face: 'happy', arms: 'lout' }) +
        heart(128, 288, 0.9),
    ),

  'major-07-chariot': () =>
    svg(
      bg('gold') +
        castle(36, 232, 0.9) +
        castle(220, 232, 0.9) +
        ground(250, C.mint, 6) +
        `<path d="M66,232 V112 M190,232 V112" stroke="${C.goldD}" stroke-width="6"/>` +
        `<rect x="54" y="90" width="148" height="28" rx="10" fill="${C.navy}"/>` +
        [74, 102, 128, 154, 182].map((x) => star(x, 104, 0.55, C.gold)).join('') +
        jelly(128, 238, { s: 0.95, color: 'sky', face: 'determined', acc: hat.crown() }) +
        `<circle cx="58" cy="286" r="24" fill="${C.gold}" stroke="${C.goldD}" stroke-width="4"/><circle cx="198" cy="286" r="24" fill="${C.gold}" stroke="${C.goldD}" stroke-width="4"/>` +
        `<rect x="56" y="216" width="144" height="80" rx="12" fill="#d9cffb" stroke="${C.lilacD}" stroke-width="3"/>` +
        `<path d="M128,250 q-24,-14 -40,-4 q16,2 22,12Z M128,250 q24,-14 40,-4 q-16,2 -22,12Z" fill="${C.sky}"/><circle cx="128" cy="254" r="10" fill="${C.gold}" stroke="${C.goldD}" stroke-width="2.5"/>` +
        [
          [80, '#4b3f86', '#fff'],
          [176, '#ffffff', C.ink],
        ]
          .map(
            ([x, c, e]) =>
              `<ellipse cx="${x}" cy="346" rx="32" ry="14" fill="${c}" stroke="${C.lilacD}" stroke-width="2"/>` +
              `<path d="M${x - 18},318 L${x - 22},346 L${x + 22},346 L${x + 18},318Z" fill="${C.gold}" stroke="${C.goldD}" stroke-width="2"/>` +
              `<circle cx="${x}" cy="320" r="15" fill="${c}" stroke="${C.lilacD}" stroke-width="2"/>` +
              `<circle cx="${x - 5}" cy="320" r="2.4" fill="${e}"/><circle cx="${x + 5}" cy="320" r="2.4" fill="${e}"/>`,
          )
          .join(''),
    ),

  'major-08-strength': () =>
    svg(
      bg('gold') +
        mountains(270, C.sky) +
        ground(310, C.mint, 10) +
        `<ellipse cx="186" cy="322" rx="60" ry="30" fill="${C.orange}"/><path d="M240,312 q20,-6 14,-26" stroke="${C.orange}" stroke-width="7" fill="none" stroke-linecap="round"/>` +
        lion(164, 264, 1.15) +
        jelly(80, 326, {
          s: 1.05,
          color: 'white',
          face: 'calm',
          arms: [
            [-42, -24, -35],
            [50, -50, -25],
          ],
          acc: hat.flowers() + hat.infinity(),
        }),
    ),

  'major-09-hermit': () =>
    svg(
      bg('night') +
        dots([
          [30, 50],
          [90, 80],
          [200, 40],
          [236, 110],
          [150, 60],
          [40, 150],
        ]) +
        `<path d="M0,372 L0,320 Q128,262 256,320 L256,372Z" fill="${C.lilac}"/>` +
        `<path d="M184,336 L176,150" stroke="${C.brown}" stroke-width="7" stroke-linecap="round"/>` +
        jelly(128, 330, {
          s: 1.2,
          color: 'grey',
          face: 'calm',
          arms: [
            [-46, -60, -50],
            [46, -40, 10],
          ],
          acc: hat.hood('#b3acd0') + hat.beard(),
        }) +
        lantern(60, 290, 1.45),
    ),

  'major-10-wheel-of-fortune': () => {
    let spokes = ''
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2
      spokes += `<path d="M${(128 + Math.cos(a) * 26).toFixed(1)},${(200 + Math.sin(a) * 26).toFixed(1)} L${(128 + Math.cos(a) * 70).toFixed(1)},${(200 + Math.sin(a) * 70).toFixed(1)}" stroke="${C.goldD}" stroke-width="4" stroke-linecap="round"/>`
    }
    const letters = ['T', 'A', 'R', 'O']
      .map((l, i) => {
        const a = -Math.PI / 2 + (i * Math.PI) / 2
        return `<text x="${(128 + Math.cos(a) * 80).toFixed(1)}" y="${(200 + Math.sin(a) * 80 + 7).toFixed(1)}" text-anchor="middle" font-family="Georgia, serif" font-size="20" font-weight="700" fill="${C.navy}">${l}</text>`
      })
      .join('')
    return svg(
      bg('soft') +
        cloud(38, 62, 0.8) +
        cloud(218, 62, 0.8) +
        cloud(38, 340, 0.8) +
        cloud(218, 340, 0.8) +
        `<circle cx="128" cy="200" r="96" fill="${C.gold}" stroke="${C.goldD}" stroke-width="5"/><circle cx="128" cy="200" r="70" fill="#fff3c9" stroke="${C.goldD}" stroke-width="3"/>` +
        spokes +
        `<circle cx="128" cy="200" r="26" fill="${C.gold}" stroke="${C.goldD}" stroke-width="3"/>` +
        star(128, 200, 1.6, '#fff') +
        letters +
        `<path d="M40,150 q-14,30 4,56 q18,26 0,60" stroke="${C.goldD}" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="40" cy="146" r="7" fill="${C.goldD}"/>` +
        jelly(128, 112, {
          s: 0.5,
          color: 'sky',
          face: 'smug',
          acc: `<path d="M-30,-70 L-46,-20 L-30,-30 Z M30,-70 L46,-20 L30,-30Z" fill="${C.sky}" stroke="#94d0f2" stroke-width="2"/>`,
        }) +
        sword(158, 96, 50, 20, 0.7),
    )
  },

  'major-11-justice': () =>
    svg(
      bg('lilac') +
        `<rect x="50" y="70" width="156" height="266" fill="#c9b8ff"/>` +
        pillar(34, 336, 270, '#b3acd0') +
        pillar(222, 336, 270, '#b3acd0') +
        ground(336, '#b3acd0', 0) +
        sword(184, 252, 160, 0, 1) +
        jelly(128, 330, {
          s: 1.15,
          color: 'peach',
          face: 'determined',
          arms: 'rup',
          under: hat.cape(C.red),
          acc: hat.crown(),
        }) +
        scales(70, 290, 1.05),
    ),

  'major-12-hanged-man': () =>
    svg(
      bg('lilac') +
        `<path d="M54,372 L54,70 M202,372 L202,70" stroke="${C.brown}" stroke-width="16" stroke-linecap="round"/><path d="M40,72 H216" stroke="${C.brown}" stroke-width="16" stroke-linecap="round"/>` +
        [
          [40, 62],
          [216, 62],
          [54, 160],
          [202, 200],
        ]
          .map(
            ([x, y]) =>
              `<ellipse cx="${x}" cy="${y}" rx="12" ry="6" fill="${C.leaf}" transform="rotate(-30 ${x} ${y})"/>`,
          )
          .join('') +
        `<path d="M128,78 V110" stroke="${C.brownD}" stroke-width="4"/>` +
        jelly(128, 112, {
          s: 1.35,
          rot: 180,
          color: 'sky',
          face: 'calm',
          acc: hat.halo() + `<path d="M-42,-20 Q0,-6 42,-20" stroke="${C.red}" stroke-width="10" fill="none"/>`,
        }) +
        ground(350, C.mint, 0),
    ),

  'major-13-death': () =>
    svg(
      bg('grey') +
        `<circle cx="214" cy="252" r="20" fill="${C.gold}" opacity=".9"/>` +
        `<rect x="186" y="200" width="14" height="54" fill="#8f89ad"/><rect x="230" y="200" width="14" height="54" fill="#8f89ad"/>` +
        ground(252, '#8f89ad', 0) +
        horse(116, 300, { s: 0.92, color: '#fff', mane: '#4b3f86' }) +
        jelly(108, 286, { s: 0.6, color: 'white', face: 'skull', blush: false, acc: hat.helmet(C.ink) }) +
        banner(76, 290, 190, C.ink, roseBadge(110, 122, 16)),
    ),

  'major-14-temperance': () =>
    svg(
      bg('soft') +
        `<circle cx="210" cy="230" r="14" fill="${C.gold}"/><path d="M196,240 Q210,170 224,240" stroke="#fff" stroke-width="6" fill="none" opacity=".6"/>` +
        `<path d="M0,316 Q70,300 120,320 L120,372 L0,372Z" fill="${C.skyD}"/>` +
        `<path d="M120,320 Q190,300 256,318 L256,372 L120,372Z" fill="${C.mint}"/>` +
        flower(22, 336, 0.9, C.sky) +
        flower(40, 330, 0.8, C.lilac) +
        wing(108, 230, 1.3) +
        wing(148, 230, 1.3, true) +
        jelly(128, 330, {
          s: 1.15,
          color: 'white',
          face: 'calm',
          arms: [
            [-46, -50, -20],
            [46, -30, 20],
          ],
          acc: `<circle cx="0" cy="-74" r="6" fill="${C.gold}"/><path d="M-12,-14 L0,-30 L12,-14Z" fill="none" stroke="${C.gold}" stroke-width="3"/><rect x="-14" y="-16" width="28" height="12" fill="none" stroke="${C.goldD}" stroke-width="2"/>`,
        }) +
        `<path d="M58,192 Q128,138 196,248" stroke="${C.skyD}" stroke-width="7" fill="none" stroke-linecap="round"/>` +
        cup(70, 236, 0.75, { rot: -35, heart: false }) +
        cup(186, 300, 0.75, { rot: 20, heart: false }),
    ),

  'major-15-devil': () =>
    svg(
      bg('storm') +
        batWing(98, 168, false) +
        batWing(158, 168, true) +
        `<rect x="86" y="226" width="84" height="80" rx="6" fill="#2c2652" stroke="#4b3f86" stroke-width="3"/><circle cx="128" cy="268" r="8" fill="none" stroke="${C.greyD}" stroke-width="4"/>` +
        jelly(128, 232, {
          s: 1.2,
          color: 'purple',
          face: 'smug',
          arms: 'out',
          acc:
            hat.horns(C.gold) +
            `<g transform="translate(0,-70) rotate(180)"><path d="M0,-9 L2.6,-2.8 L8.6,-2.8 L3.8,1.4 L5.6,8 L0,4 L-5.6,8 L-3.8,1.4 L-8.6,-2.8 L-2.6,-2.8Z" fill="${C.gold}"/></g>`,
        }) +
        ground(336, '#2c2652', 0) +
        chain(128, 276, 66, 286) +
        chain(128, 276, 190, 286) +
        jelly(60, 350, {
          s: 0.68,
          color: 'pink',
          face: 'sad',
          acc: hat.horns(C.lilacD) + `<path d="M40,-10 q20,0 16,-20" stroke="${C.pink}" stroke-width="5" fill="none"/>`,
        }) +
        jelly(196, 350, {
          s: 0.68,
          color: 'sky',
          face: 'sad',
          acc:
            hat.horns(C.lilacD) + `<path d="M-40,-10 q-20,0 -16,-20" stroke="${C.sky}" stroke-width="5" fill="none"/>`,
        }),
    ),

  'major-18-moon': () =>
    svg(
      bg('night') +
        `<circle cx="128" cy="112" r="78" fill="#e6dcff" opacity=".12"/><circle cx="128" cy="112" r="64" fill="#e6dcff" opacity=".14"/>` +
        `<circle cx="128" cy="112" r="54" fill="#f3efff"/>` +
        `<path d="M128,58 A54,54 0 0,1 128,166 A30,54 0 0,0 128,58Z" fill="${C.lilacD}" opacity=".55"/>` +
        dots(
          [
            [40, 60],
            [214, 50],
            [30, 150],
            [230, 170],
            [70, 200],
            [190, 210],
          ],
          '#fff',
          1.5,
          0.6,
        ) +
        `<path d="M100,108 q8,6 16,0 M136,108 q8,6 16,0" stroke="${C.ink}" stroke-width="2.6" fill="none" stroke-linecap="round"/><ellipse cx="102" cy="124" rx="7" ry="4" fill="${C.rose}" opacity=".7"/><ellipse cx="154" cy="124" rx="7" ry="4" fill="${C.rose}" opacity=".7"/>` +
        `<rect x="14" y="214" width="34" height="90" fill="${C.lilacD}"/><path d="M10,216 L31,196 L52,216Z" fill="#8d7fd1"/>` +
        `<rect x="208" y="214" width="34" height="90" fill="${C.lilacD}"/><path d="M204,216 L225,196 L246,216Z" fill="#8d7fd1"/>` +
        hills(300, '#3f7f6f') +
        dog(74, 300, { s: 1.1, howl: true }) +
        dog(182, 300, { s: 1.1, howl: true, flip: true, color: '#b3acd0', ear: '#8f89ad' }) +
        `<path d="M0,336 Q128,322 256,336 L256,372 L0,372Z" fill="${C.skyD}"/>` +
        `<ellipse cx="128" cy="346" rx="12" ry="8" fill="${C.orange}"/><path d="M118,340 q-10,-10 -6,-18 M138,340 q10,-10 6,-18" stroke="${C.orange}" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="124" cy="342" r="1.6" fill="${C.ink}"/><circle cx="132" cy="342" r="1.6" fill="${C.ink}"/>`,
    ),

  'major-19-sun': () =>
    svg(
      bg('day') +
        sunRays(128, 104, 58, 16, C.gold) +
        sun(128, 104, 58) +
        `<rect x="0" y="246" width="256" height="50" fill="#d6d1ea"/><path d="M0,262 H256 M0,280 H256 M40,246 v16 M100,246 v16 M160,246 v16 M220,246 v16 M70,262 v18 M130,262 v18 M190,262 v18" stroke="#b3acd0" stroke-width="2"/>` +
        sunflower(30, 242, 1) +
        sunflower(78, 232, 1.1) +
        sunflower(178, 232, 1.1) +
        sunflower(226, 242, 1) +
        ground(330, C.mint, 0) +
        horse(110, 318, { s: 0.82, color: '#fff' }) +
        `<path d="M70,300 L64,214" stroke="${C.brownD}" stroke-width="4" stroke-linecap="round"/><path d="M64,216 Q40,206 18,224 Q34,236 26,252 Q48,236 66,250Z" fill="${C.red}"/>` +
        jelly(102, 302, { s: 0.55, color: 'pink', face: 'happy', arms: 'up', acc: hat.wreath() }),
    ),

  'major-20-judgement': () =>
    svg(
      bg('soft') +
        mountains(300, '#fff') +
        sea(300, C.skyD) +
        wing(116, 86, 1) +
        wing(140, 86, 1, true) +
        jelly(128, 150, {
          s: 0.8,
          color: 'white',
          face: 'calm',
          arms: 'rout',
          acc: `<path d="M-24,-80 q0,-20 10,-22 q2,10 8,6 q4,-12 14,-6 q8,-6 12,6Z" fill="${C.gold}"/>`,
        }) +
        cloud(70, 160, 1.4) +
        cloud(186, 160, 1.4) +
        cloud(128, 172, 1.5) +
        `<path d="M146,108 L206,152" stroke="${C.goldD}" stroke-width="7" stroke-linecap="round"/><ellipse cx="208" cy="154" rx="16" ry="10" fill="${C.gold}" stroke="${C.goldD}" stroke-width="2.5" transform="rotate(37 208 154)"/>` +
        `<path d="M168,124 L196,144 L184,172 L156,152Z" fill="#fff" stroke="${C.lilac}" stroke-width="2"/><path d="M176,140 L176,160 M166,150 L186,150" stroke="${C.red}" stroke-width="4" transform="rotate(37 176 150)"/>` +
        [
          [58, 'grey'],
          [128, 'sky'],
          [198, 'pink'],
        ]
          .map(
            ([x, c]) =>
              jelly(x, 334, { s: 0.55, color: c, face: 'happy', arms: 'up' }) +
              `<rect x="${x - 32}" y="326" width="64" height="24" rx="4" fill="${C.brown}"/><rect x="${x - 32}" y="326" width="64" height="7" rx="3" fill="#c99a6e"/>`,
          )
          .join(''),
    ),

  'major-21-world': () => {
    let wreath = ''
    for (let i = 0; i < 40; i++) {
      const a = (i / 40) * Math.PI * 2
      const x = 128 + Math.cos(a) * 74
      const y = 192 + Math.sin(a) * 114
      wreath += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="11" ry="5.5" fill="${i % 2 ? C.leaf : C.mintD}" transform="rotate(${((a * 180) / Math.PI + 60).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`
    }
    const bow = (y) =>
      `<path d="M128,${y} l-16,-10 v20Z M128,${y} l16,-10 v20Z" fill="${C.red}"/><circle cx="128" cy="${y}" r="4" fill="${C.red}"/>`
    return svg(
      bg('soft') +
        cloud(34, 52, 0.7) +
        cloud(222, 52, 0.7) +
        cloud(34, 330, 0.7) +
        cloud(222, 330, 0.7) +
        jelly(34, 52, { s: 0.3, color: 'white', face: 'calm' }) +
        `<circle cx="222" cy="40" r="11" fill="${C.gold}" stroke="${C.goldD}" stroke-width="2"/><path d="M231,40 l8,3 l-8,3Z" fill="${C.goldD}"/><circle cx="224" cy="37" r="1.6" fill="${C.ink}"/>` +
        `<circle cx="34" cy="318" r="12" fill="${C.brown}"/><path d="M24,310 q-8,-6 -6,-12 M44,310 q8,-6 6,-12" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="30" cy="318" r="1.6" fill="${C.ink}"/><circle cx="38" cy="318" r="1.6" fill="${C.ink}"/>` +
        lion(222, 318, 0.32) +
        wreath +
        bow(78) +
        bow(306) +
        wand(78, 220, 54, -20, 0.7) +
        wand(178, 220, 54, 20, 0.7) +
        jelly(128, 252, {
          s: 0.95,
          color: 'lilac',
          face: 'happy',
          arms: 'out',
          rot: -6,
          acc: `<path d="M-42,-30 Q0,-60 42,-20 Q30,-6 20,0 Q10,-30 -36,-20Z" fill="#8d7fd1" opacity=".85"/>`,
        }),
    )
  },
}
