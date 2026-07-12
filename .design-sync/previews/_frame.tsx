// Shared preview backdrop. The DS is dark-by-default (tokens live in :root),
// but the design-sync card html forces a white body — so bare components render
// light-on-white. Wrapping each preview in the theme's own bg-background gives
// the correct dark surface. Not a component; never uploaded.
import type { ReactNode } from 'react'

export function Frame({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`bg-background text-foreground flex flex-col items-center justify-center gap-6 p-10 ${className}`}
    >
      {children}
    </div>
  )
}
