import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  size?: number
}

export default function StarRating({ rating, size = 16 }: StarRatingProps) {
  const fullStars = Math.floor(rating)
  const hasHalf = rating - fullStars >= 0.5

  return (
    <div className="flex items-center gap-0.5" aria-label={`评分 ${rating} / 5`}>
      {[...Array(5)].map((_, i) => {
        const filled = i < fullStars || (i === fullStars && hasHalf)
        return (
          <Star
            key={i}
            size={size}
            className={`
              ${filled ? 'fill-red text-red' : 'text-ink/20'}
              ${i === fullStars && hasHalf ? 'fill-red/50' : ''}
            `}
          />
        )
      })}
      <span className="ml-1 font-hand text-lg text-ink-soft">{rating.toFixed(1)}</span>
    </div>
  )
}
