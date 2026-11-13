import { Longi } from '~/components/longi/Longi'
import { KeywordList } from '~/components/ui/Keyword'
import { Panel, SectionTitle } from '~/components/ui/Panel'
import type { ReadingSummary } from '~/models/reading'

export function LongiSummary({ summary }: { summary: ReadingSummary }) {
  return (
    <Panel className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Longi size="sm" mood="wink" />
        <SectionTitle>롱이의 한마디</SectionTitle>
      </div>
      {summary.lines.map((line) => (
        <p key={line} className="leading-relaxed text-pretty">
          {line}
        </p>
      ))}
      <KeywordList items={summary.tags} />
    </Panel>
  )
}
