export default function Tape({ className = '' }: { className?: string }) {
  return (
    <div
      className={`absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/70 border border-ink/10 shadow-sm z-10 ${className}`}
      style={{ transform: 'translateX(-50%) rotate(-2deg)' }}
    />
  )
}
