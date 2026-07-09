interface ScribbleTitleProps {
  children: string
  as?: 'h1' | 'h2' | 'h3'
  className?: string
}

export default function ScribbleTitle({ children, as = 'h2', className = '' }: ScribbleTitleProps) {
  const Tag = as
  return (
    <Tag className={`font-display text-ink relative inline-block ${className}`}>
      {children}
      <svg
        className="absolute -bottom-1 left-0 w-full h-3"
        preserveAspectRatio="none"
        viewBox="0 0 100 12"
      >
        <path
          d="M0 6 Q 25 0, 50 6 T 100 6"
          stroke="#C94C4C"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          className="animate-draw-line"
          style={{ strokeDasharray: 1000, strokeDashoffset: 1000 }}
        />
      </svg>
    </Tag>
  )
}
