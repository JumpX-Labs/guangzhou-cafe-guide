import type { ReactNode } from 'react'

interface WobblyCardProps {
  children: ReactNode
  className?: string
  rotate?: number
  hasTape?: boolean
  onClick?: () => void
}

export default function WobblyCard({
  children,
  className = '',
  rotate = 0,
  hasTape = false,
  onClick,
}: WobblyCardProps) {
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`
        relative bg-paper-light border-2 border-ink
        rounded-wobbly-md shadow-paper
        transition-all duration-200
        hover:-translate-y-1 hover:shadow-paper-lg
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {hasTape && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/70 border border-ink/10 shadow-sm z-10"
          style={{ transform: 'translateX(-50%) rotate(-2deg)' }}
        />
      )}
      {children}
    </div>
  )
}
