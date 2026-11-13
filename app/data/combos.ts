import type { ComboRule } from '~/models/reading'

// 유명한 두 장 조합. 순서는 상관없다.
export const COMBOS: ComboRule[] = [
  {
    cards: ['major-16-tower', 'major-17-star'],
    text: '탑과 별이 함께 나왔어. 무너진 자리에 별이 뜨는 흐름이야. 지금의 흔들림 뒤엔 꼭 회복이 와.',
  },
  {
    cards: ['major-06-lovers', 'cups-02-two'],
    text: '연인과 컵 2가 같이 나왔어. 서로 마음이 통하는 아주 강한 사랑의 신호야.',
  },
  {
    cards: ['major-13-death', 'major-20-judgement'],
    text: '죽음과 심판이 함께야. 하나를 끝내고 완전히 새롭게 태어나는 큰 전환점이야.',
  },
  {
    cards: ['major-19-sun', 'major-21-world'],
    text: '태양과 세계! 노력이 환하게 완성되는, 최고의 성취 조합이야.',
  },
  {
    cards: ['major-18-moon', 'major-02-high-priestess'],
    text: '달과 여사제가 같이 나왔어. 직감이 아주 예민한 때야. 꿈이나 느낌을 흘려듣지 마.',
  },
  {
    cards: ['major-15-devil', 'major-06-lovers'],
    text: '악마와 연인이 함께야. 끌림이 강하지만 집착으로 변하지 않게 마음을 살펴봐.',
  },
  {
    cards: ['major-01-magician', 'wands-01-ace'],
    text: '마법사와 완드 에이스. 아이디어를 바로 실행에 옮기기 딱 좋은 타이밍이야.',
  },
  {
    cards: ['major-10-wheel-of-fortune', 'major-00-fool'],
    text: '운명의 수레바퀴와 바보. 예상 못 한 새 출발이 운명처럼 찾아올 거야.',
  },
  {
    cards: ['swords-03-three', 'cups-05-five'],
    text: '소드 3과 컵 5가 함께 나왔어. 마음이 많이 아픈 때야. 충분히 슬퍼하고, 남은 것도 꼭 봐줘.',
  },
  {
    cards: ['swords-09-nine', 'major-18-moon'],
    text: '소드 9와 달. 걱정이 상상 속에서 너무 커져 있어. 실제로 확인해보면 생각보다 괜찮을 거야.',
  },
  {
    cards: ['cups-10-ten', 'pentacles-10-ten'],
    text: '컵 10과 펜타클 10! 마음도 생활도 함께 꽉 차는, 가정과 안정의 최고 조합이야.',
  },
  {
    cards: ['pentacles-01-ace', 'major-03-empress'],
    text: '펜타클 에이스와 여황제. 심은 씨앗이 풍성하게 자라는 금전운이야.',
  },
  {
    cards: ['wands-06-six', 'major-07-chariot'],
    text: '완드 6과 전차. 경쟁에서 이기고 당당하게 나아가는 승리의 흐름이야.',
  },
  {
    cards: ['major-09-hermit', 'swords-04-four'],
    text: '은둔자와 소드 4. 지금은 확실히 쉬면서 혼자만의 시간을 가져야 할 때야.',
  },
  {
    cards: ['major-11-justice', 'major-20-judgement'],
    text: '정의와 심판. 지난 선택의 결과가 공정하게 돌아오는 때야.',
  },
  {
    cards: ['cups-01-ace', 'major-06-lovers'],
    text: '컵 에이스와 연인. 새로운 사랑이 시작될 아주 좋은 신호야.',
  },
  {
    cards: ['major-16-tower', 'swords-10-ten'],
    text: '탑과 소드 10. 크게 흔들리지만 여기가 바닥이야. 이제 올라갈 일만 남았어.',
  },
  {
    cards: ['major-14-temperance', 'pentacles-02-two'],
    text: '절제와 펜타클 2. 여러 가지를 균형 있게 굴리는 감각이 빛나는 때야.',
  },
  {
    cards: ['major-08-strength', 'wands-09-nine'],
    text: '힘과 완드 9. 지쳐도 버틸 힘이 충분히 있어. 거의 다 왔어.',
  },
  {
    cards: ['major-04-emperor', 'major-03-empress'],
    text: '황제와 여황제가 함께야. 안정과 풍요가 짝을 이루는 든든한 흐름이야.',
  },
]

export const NUMBER_MEANINGS: Record<number, string> = {
  1: '시작',
  2: '선택과 균형',
  3: '성장과 협력',
  4: '안정',
  5: '갈등과 변화',
  6: '조화와 회복',
  7: '시험과 성찰',
  8: '움직임과 힘',
  9: '거의 다 온 마무리',
  10: '끝과 새 시작',
}
