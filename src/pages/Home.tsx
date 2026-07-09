import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, MapPin, Sparkles } from 'lucide-react'
import { useCafes } from '../hooks/useCafes.ts'
import { useDistricts } from '../hooks/useDistricts.ts'
import WobblyCard from '../components/WobblyCard.tsx'
import StarRating from '../components/StarRating.tsx'
import Tag from '../components/Tag.tsx'
import ScribbleTitle from '../components/ScribbleTitle.tsx'
import Tape from '../components/Tape.tsx'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24, rotate: -2 },
  visible: { opacity: 1, y: 0, rotate: 0 },
}

function HeroMap({ districts }: { districts: { id: string; name: string; slug: string; position: { x: number; y: number } }[] }) {
  const navigate = useNavigate()

  return (
    <div className="relative w-full max-w-2xl mx-auto aspect-[4/3] bg-paper-light rounded-wobbly-lg border-2 border-ink p-4 shadow-paper-lg overflow-hidden">
      <Tape />
      <div className="coffee-stain w-32 h-32 -top-8 -right-8" />
      <div className="coffee-stain w-24 h-24 bottom-12 left-8" />

      <svg viewBox="0 0 400 300" className="w-full h-full" aria-label="广州街区手绘地图">
        <path
          d="M-20 200 Q 80 180, 180 210 T 420 190"
          stroke="#5A7D6E"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M120 110 L 180 70 L 240 90 L 280 130 L 220 170 L 160 160 Z"
          stroke="#2C2A26"
          strokeWidth="2"
          fill="none"
          strokeDasharray="6 4"
          opacity="0.4"
        />
        {districts.map((d) => (
          <g
            key={d.id}
            transform={`translate(${d.position.x * 3.5}, ${d.position.y * 2.8})`}
            className="cursor-pointer"
            onClick={() => navigate(`/explore?district=${d.slug}`)}
          >
            <circle r="14" fill="#C94C4C" opacity="0.9" stroke="#2C2A26" strokeWidth="2" />
            <text
              y="-18"
              textAnchor="middle"
              className="font-display"
              fill="#2C2A26"
              fontSize="12"
              fontWeight="bold"
            >
              {d.name}
            </text>
          </g>
        ))}
      </svg>

      <div className="absolute bottom-4 right-4 bg-paper/90 border-2 border-ink rounded-wobbly-sm px-3 py-1.5 text-xs font-body">
        点击红点开始探店
      </div>
    </div>
  )
}

function Loading() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-12 h-12 border-4 border-ink/20 border-t-red rounded-full animate-spin" />
    </div>
  )
}

export default function Home() {
  const { cafes, loading: cafesLoading, error: cafesError } = useCafes()
  const { districts, loading: districtsLoading } = useDistricts()

  const featuredCafes = cafes.filter((c) =>
    ['miaoqian', 'xiaojing', 'tianhuan'].includes(c.id)
  )

  const loading = cafesLoading || districtsLoading

  if (loading) return <Loading />

  if (cafesError) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center text-red">
        <p>加载失败：{cafesError}</p>
        <p className="text-sm text-ink-soft mt-2">请确认后端服务是否已启动</p>
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto px-4 py-8 space-y-16"
    >
      <section className="grid lg:grid-cols-2 gap-8 items-center">
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-red/10 border-2 border-red rounded-wobbly-sm px-3 py-1 text-red text-sm font-body">
            <Sparkles className="w-4 h-4" />
            广州街巷 · 咖啡地图
          </div>
          <h1 className="font-display text-5xl lg:text-7xl text-ink leading-tight">
            广州<br />
            <span className="scribble-underline">咖啡馆</span>
            <br />探店手册
          </h1>
          <p className="font-body text-lg text-ink-soft max-w-md leading-relaxed">
            从东山口的红砖洋房到六运小区的社区小店，从沙面的欧陆风情到江南西的潮流夜咖，用手绘地图打开广州的咖啡角落。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 bg-ink text-paper border-2 border-ink rounded-wobbly-md font-body hover:bg-red hover:border-red transition-colors"
            >
              开始探店
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 bg-paper-light text-ink border-2 border-ink rounded-wobbly-md font-body hover:-translate-y-0.5 transition-transform"
            >
              <MapPin className="w-4 h-4" />
              看全部 {cafes.length} 家
            </Link>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <HeroMap districts={districts} />
        </motion.div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <ScribbleTitle as="h2" className="text-3xl">本周推荐</ScribbleTitle>
          <Link to="/explore" className="font-hand text-xl text-red hover:underline">
            查看全部 →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {featuredCafes.map((cafe, index) => (
            <motion.div
              key={cafe.id}
              variants={itemVariants}
              whileHover={{ y: -8, rotate: index % 2 === 0 ? -1 : 1 }}
            >
              <Link to={`/cafe/${cafe.slug}`} className="block h-full">
                <WobblyCard className="h-full overflow-hidden" rotate={index % 2 === 0 ? -1 : 1} hasTape>
                  <div className="h-40 overflow-hidden">
                    <img src={cafe.image} alt={cafe.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-xl">{cafe.name}</h3>
                      <StarRating rating={cafe.rating} size={14} />
                    </div>
                    <p className="text-sm text-ink-soft line-clamp-2">{cafe.recommendation}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {cafe.tags.slice(0, 2).map((tag) => (
                        <Tag key={tag} variant="brown">
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
      </section>

      <section className="space-y-6">
        <ScribbleTitle as="h2" className="text-3xl">按街区逛逛</ScribbleTitle>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {districts.map((district, index) => (
            <motion.div
              key={district.id}
              variants={itemVariants}
              whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? -2 : 2 }}
            >
              <Link to={`/explore?district=${district.slug}`} className="block h-full">
                <WobblyCard
                  className="p-4 text-center h-full flex flex-col items-center justify-center gap-2"
                  rotate={index % 2 === 0 ? -2 : 2}
                >
                  <span className="font-display text-lg">{district.name}</span>
                  <span className="text-xs text-ink-soft line-clamp-2">
                    {district.description}
                  </span>
                </WobblyCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  )
}
