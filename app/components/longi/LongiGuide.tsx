import type { ReactNode } from 'react'
import { Longi } from './Longi'

export function SpeechBubble({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`rounded-[22px_22px_22px_6px] bg-surface px-4 py-3 leading-relaxed text-pretty ${className}`}>
      {children}
    </p>
  )
}

/** 작은 롱이 + 말풍선 한 줄 */
export function LongiGuide({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <Longi size="sm" />
      <SpeechBubble className="text-sm">{children}</SpeechBubble>
    </div>
  )
}
