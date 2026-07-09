import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, MapPin, Heart, ExternalLink } from 'lucide-react'
import { useCafe } from '../hooks/useCafe.ts'
import { useCafes } from '../hooks/useCafes.ts'
import { useDistricts } from '../hooks/useDistricts.ts'
import WobblyCard from '../components/WobblyCard.tsx'
import StarRating from '../components/StarRating.tsx'
import Tag from '../components/Tag.tsx'
import ScribbleTitle from '../components/ScribbleTitle.tsx'
import Tape from '../components/Tape.tsx'
import { useFavorites } from '../hooks/useFavorites.ts'

export default function CafeDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { toggle, isFavorite } = useFavorites()

  const { cafe, loading, error } = useCafe(slug)
  const { cafes: allCafes } = useCafes()
  const { districts } = useDistricts()

  const similar = !cafe
    ? []
    : allCafes
        .filter(
          (c) =>
            c.id !== cafe.id &&
            (c.district === cafe.district || c.tags.some((t) => cafe.tags.includes(t)))
        )
        .slice(0, 3)

  const district = districts.find((d) => d.slug === cafe?.district)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-ink/20 border-t-red rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !cafe) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="font-display text-3xl mb-4">
          {error ? `加载失败：${error}` : '这家馆还没被收录'}
        </p>
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 px-4 py-2 bg-ink text-paper rounded-wobbly-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          返回探店清单
        </Link>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto px-4 py-8 space-y-10"
    >
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1 text-ink-soft hover:text-ink font-body"
      >
        <ArrowLeft className="w-4 h-4" />
        返回
      </button>

      <div className="relative">
        <WobblyCard className="overflow-hidden" rotate={-0.5}>
          <div className="h-64 md:h-80 lg:h-96 overflow-hidden">
            <img src={cafe.image} alt={cafe.name} className="w-full h-full object-cover" />
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => toggle(cafe.id)}
              className={`p-2 rounded-full border-2 transition-colors ${
                isFavorite(cafe.id)
                  ? 'bg-red border-red text-paper'
                  : 'bg-paper/90 border-ink text-ink'
              }`}
              aria-label={isFavorite(cafe.id) ? '取消收藏' : '收藏'}
            >
              <Heart className={`w-5 h-5 ${isFavorite(cafe.id) ? 'fill-current' : ''}`} />
            </button>
          </div>
        </WobblyCard>
        <Tape />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-4xl md:text-5xl text-ink">{cafe.name}</h1>
              <p className="font-hand text-2xl text-red mt-1">{cafe.recommendation}</p>
            </div>
            <div className="text-right">
              <StarRating rating={cafe.rating} size={18} />
              <p className="text-sm text-ink-soft mt-1">{cafe.priceRange}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {cafe.tags.map((tag) => (
              <Tag key={tag} variant="red">
                {tag}
              </Tag>
            ))}
          </div>

          <p className="font-body text-lg leading-relaxed text-ink-soft">{cafe.description}</p>

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="inline-flex items-center gap-2 bg-paper-light border-2 border-ink/20 rounded-wobbly-sm px-3 py-1.5">
              <MapPin className="w-4 h-4 text-red" />
              {cafe.address}
            </div>
            <div className="inline-flex items-center gap-2 bg-paper-light border-2 border-ink/20 rounded-wobbly-sm px-3 py-1.5">
              <Clock className="w-4 h-4 text-green" />
              {cafe.hours}
            </div>
            {district && (
              <Link
                to={`/explore?district=${district.slug}`}
                className="inline-flex items-center gap-2 bg-paper-light border-2 border-ink/20 rounded-wobbly-sm px-3 py-1.5 hover:border-red"
              >
                <ExternalLink className="w-4 h-4" />
                {district.name} 更多店
              </Link>
            )}
          </div>
        </div>

        <WobblyCard className="p-5 h-fit" rotate={1}>
          <ScribbleTitle as="h3" className="text-xl mb-3">氛围</ScribbleTitle>
          <p className="font-body text-ink-soft">{cafe.vibe}</p>
        </WobblyCard>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <WobblyCard className="p-5" rotate={-1}>
          <ScribbleTitle as="h3" className="text-xl mb-4">招牌饮品</ScribbleTitle>
          <ul className="space-y-2">
            {cafe.signatureDrinks.map((drink, i) => (
              <li key={drink} className="flex items-center gap-3 font-body text-ink-soft">
                <span className="w-6 h-6 flex items-center justify-center bg-red/10 text-red rounded-full text-xs font-hand">
                  {i + 1}
                </span>
                {drink}
              </li>
            ))}
          </ul>
        </WobblyCard>

        <WobblyCard className="p-5" rotate={1}>
          <ScribbleTitle as="h3" className="text-xl mb-4">探店小贴士</ScribbleTitle>
          <ul className="space-y-2">
            {cafe.tips.map((tip) => (
              <li key={tip} className="flex items-start gap-2 font-body text-ink-soft">
                <span className="text-green mt-1">✎</span>
                {tip}
              </li>
            ))}
          </ul>
        </WobblyCard>
      </div>

      {similar.length > 0 && (
        <section className="space-y-6">
          <ScribbleTitle as="h2" className="text-2xl">相似推荐</ScribbleTitle>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similar.map((c, index) => (
              <Link key={c.id} to={`/cafe/${c.slug}`} className="block h-full">
                <WobblyCard className="h-full overflow-hidden" rotate={index % 2 === 0 ? -1 : 1}>
                  <div className="h-32 overflow-hidden">
                    <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-lg">{c.name}</h3>
                    <p className="text-sm text-ink-soft line-clamp-2 mt-1">{c.recommendation}</p>
                  </div>
                </WobblyCard>
              </Link>
            ))}
          </div>
        </section>
      )}
    </motion.div>
  )
}
