interface TagProps {
  children: string
  variant?: 'default' | 'red' | 'green' | 'brown'
  onClick?: () => void
  active?: boolean
}

const variantMap = {
  default: 'bg-paper border-ink text-ink',
  red: 'bg-red/10 border-red text-red',
  green: 'bg-green/10 border-green text-green',
  brown: 'bg-brown/10 border-brown text-brown',
}

export default function Tag({ children, variant = 'default', onClick, active }: TagProps) {
  return (
    <span
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`
        inline-flex items-center px-3 py-1
        font-body text-xs border-2 rounded-wobbly-sm
        transition-all
        ${variantMap[variant]}
        ${onClick ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-paper' : ''}
        ${active ? 'bg-ink text-paper border-ink' : ''}
      `}
    >
      {children}
    </span>
  )
}
