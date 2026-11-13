import type { Spread, Topic } from '~/models/reading'

export const SPREADS: Spread[] = [
  {
    id: 'one',
    name: '원카드',
    desc: '오늘의 한마디',
    about: '질문 하나에 카드 한 장. 가장 간단하고 또렷하게 답을 들을 수 있는 배열이야.',
    fanSize: 12,
    jelly: 'gold',
    positions: [{ key: 'answer', label: '답', description: '지금 질문에 대한 별의 한마디' }],
  },
  {
    id: 'three',
    name: '쓰리카드',
    desc: '과거 · 현재 · 미래',
    about: '과거의 원인, 지금의 상태, 앞으로의 흐름을 한 줄로 읽는 가장 기본 배열이야.',
    fanSize: 12,
    jelly: 'pink',
    positions: [
      { key: 'past', label: '과거', description: '지금 상황을 만든 지난 흐름' },
      { key: 'present', label: '현재', description: '지금 네가 서 있는 자리' },
      { key: 'future', label: '미래', description: '이대로 가면 펼쳐질 흐름' },
    ],
  },
  {
    id: 'love',
    name: '연애운',
    desc: '나 · 상대 · 관계',
    about: '내 마음, 상대의 마음, 그리고 둘 사이의 흐름을 함께 보는 배열이야.',
    fanSize: 12,
    fixedTopic: 'love',
    jelly: 'rose',
    positions: [
      { key: 'me', label: '나', description: '이 관계에서 내 마음' },
      { key: 'partner', label: '상대', description: '상대의 마음과 입장' },
      { key: 'relation', label: '관계', description: '둘 사이의 흐름과 앞으로' },
    ],
  },
  {
    id: 'celtic',
    name: '켈틱 크로스',
    desc: '깊게 들여다보기',
    about: '열 장으로 상황의 안과 밖, 원인과 결과를 깊이 들여다보는 전통 배열이야.',
    fanSize: 12,
    jelly: 'sky',
    positions: [
      { key: 'present', label: '현재', description: '지금 상황의 중심' },
      { key: 'challenge', label: '장애물', description: '지금 가로막고 있는 것' },
      { key: 'foundation', label: '기반', description: '이 상황의 뿌리, 무의식' },
      { key: 'past', label: '과거', description: '지나가고 있는 흐름' },
      { key: 'goal', label: '목표', description: '의식적으로 바라는 것, 가능성' },
      { key: 'near-future', label: '가까운 미래', description: '곧 다가올 흐름' },
      { key: 'self', label: '나', description: '이 상황을 대하는 내 태도' },
      { key: 'environment', label: '주변', description: '주변 사람과 환경의 영향' },
      { key: 'hopes', label: '희망과 두려움', description: '마음속 기대와 걱정' },
      { key: 'outcome', label: '결과', description: '이대로 갈 때의 결말' },
    ],
  },
]

export const TOPICS: { id: Topic; label: string }[] = [
  { id: 'general', label: '종합' },
  { id: 'love', label: '연애' },
  { id: 'work', label: '일' },
  { id: 'money', label: '금전' },
]

export function getSpread(id: string | null | undefined): Spread | undefined {
  return SPREADS.find((spread) => spread.id === id)
}

export function isTopic(value: string | null | undefined): value is Topic {
  return TOPICS.some((topic) => topic.id === value)
}
