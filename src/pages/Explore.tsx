import { useState, useMemo, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, X, Coffee, SlidersHorizontal } from 'lucide-react'
import { useCafes } from '../hooks/useCafes.ts'
import { useDistricts } from '../hooks/useDistricts.ts'
import WobblyCard from '../components/WobblyCard.tsx'
import StarRating from '../components/StarRating.tsx'
import Tag from '../components/Tag.tsx'
import ScribbleTitle from '../components/ScribbleTitle.tsx'
import { useFavorites } from '../hooks/useFavorites.ts'

const sortOptions = [
  { label: '综合推荐', value: 'featured' },
  { label: '评分最高', value: 'rating' },
  { label: '价格最低', value: 'price' },
]

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialDistrict = searchParams.get('district') || ''

  const [search, setSearch] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState(initialDistrict)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sort, setSort] = useState('featured')
  const { toggle, isFavorite } = useFavorites()

  const { cafes, loading, error } = useCafes()
  const { districts } = useDistricts()

  useEffect(() => {
    const district = searchParams.get('district') || ''
    setSelectedDistrict(district)
  }, [searchParams])

  const allTags = useMemo(() => {
    return Array.from(new Set(cafes.flatMap((c) => c.tags)))
  }, [cafes])

  const filtered = useMemo(() => {
    let result = [...cafes]

    if (selectedDistrict) {
      result = result.filter((c) => c.district === selectedDistrict)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q)) ||
          c.district.toLowerCase().includes(q)
      )
    }

    if (selectedTags.length > 0) {
      result = result.filter((c) =>
        selectedTags.some((tag) => c.tags.includes(tag))
      )
    }

    if (sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating)
    } else if (sort === 'price') {
      result.sort((a, b) => {
        const aMin = parseInt(a.priceRange.replace(/[^\d]/g, '')) || 0
        const bMin = parseInt(b.priceRange.replace(/[^\d]/g, '')) || 0
        return aMin - bMin
      })
    }

    return result
  }, [cafes, selectedDistrict, search, selectedTags, sort])

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const clearFilters = () => {
    setSearch('')
    setSelectedDistrict('')
    setSelectedTags([])
    setSort('featured')
    setSearchParams({})
  }

  const activeDistrict = districts.find((d) => d.slug === selectedDistrict)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-ink/20 border-t-red rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center text-red">
        <p>加载失败：{error}</p>
        <p className="text-sm text-ink-soft mt-2">请确认后端服务是否已启动</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto px-4 py-8 space-y-8"
    >
      <div className="space-y-2">
        <ScribbleTitle as="h1" className="text-4xl">探店清单</ScribbleTitle>
        <p className="font-body text-ink-soft">
          {activeDistrict
            ? `正在浏览：${activeDistrict.name}`
            : `广州共收录 ${cafes.length} 家咖啡馆，找到 ${filtered.length} 家`}
        </p>
      </div>

      <div className="bg-paper-light border-2 border-ink rounded-wobbly-md p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜店名、标签、街区..."
              className="w-full pl-9 pr-4 py-2 bg-paper border-2 border-ink/20 rounded-wobbly-sm font-body focus:outline-none focus:border-red"
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-ink-soft" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2 bg-paper border-2 border-ink/20 rounded-wobbly-sm font-body focus:outline-none focus:border-red"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Tag
            active={selectedDistrict === ''}
            onClick={() => {
              setSelectedDistrict('')
              setSearchParams({})
            }}
          >
            全部街区
          </Tag>
          {districts.map((d) => (
            <Tag
              key={d.id}
              active={selectedDistrict === d.slug}
              onClick={() => {
                setSelectedDistrict(d.slug)
                setSearchParams({ district: d.slug })
              }}
            >
              {d.name}
            </Tag>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Tag
              key={tag}
              variant="brown"
              active={selectedTags.includes(tag)}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Tag>
          ))}
        </div>

        {(selectedDistrict || search || selectedTags.length > 0 || sort !== 'featured') && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1 text-sm text-red hover:underline"
          >
            <X className="w-4 h-4" />
            清除筛选
          </button>
        )}
      </div>

      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((cafe, index) => (
            <motion.div
              key={cafe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={`/cafe/${cafe.slug}`} className="block h-full">
                <WobblyCard
                  className="h-full overflow-hidden"
                  rotate={index % 2 === 0 ? -1 : 1}
                  hasTape
                >
                  <div className="h-44 overflow-hidden relative">
                    <img
                      src={cafe.image}
                      alt={cafe.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-1 bg-paper/90 border border-ink rounded-wobbly-sm text-xs font-hand">
                        {cafe.priceRange}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-xl">{cafe.name}</h3>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          toggle(cafe.id)
                        }}
                        className="text-red hover:scale-110 transition-transform"
                        aria-label={isFavorite(cafe.id) ? '取消收藏' : '收藏'}
                      >
                        {isFavorite(cafe.id) ? '♥' : '♡'}
                      </button>
                    </div>
                    <StarRating rating={cafe.rating} size={14} />
                    <p className="text-sm text-ink-soft line-clamp-2">
                      {cafe.description}
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {cafe.tags.slice(0, 3).map((tag) => (
                        <Tag key={tag} variant="green">
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </WobblyCard>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 space-y-4">
          <div className="w-24 h-24 mx-auto border-2 border-ink rounded-full flex items-center justify-center">
            <Coffee className="w-10 h-10 text-ink-soft" />
          </div>
          <p className="font-display text-2xl">没找到合适的咖啡馆</p>
          <p className="text-ink-soft">换个关键词或筛选条件试试？</p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-red text-paper border-2 border-red rounded-wobbly-sm font-body"
          >
            清除所有筛选
          </button>
        </div>
      )}
    </motion.div>
  )
}
