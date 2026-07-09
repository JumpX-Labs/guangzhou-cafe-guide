import { useState, useEffect, useMemo } from 'react'
import { Download, RotateCcw, Plus, Pencil, Trash2, Save, X } from 'lucide-react'
import { useDistricts } from '../hooks/useDistricts.ts'
import type { CafeInput, District } from '../data/types'
import { buildImageUrl } from '../lib/images.ts'
import {
  getCafeInputs,
  createCafe,
  updateCafe,
  deleteCafe,
  resetCafes,
} from '../lib/api.ts'
import WobblyCard from '../components/WobblyCard.tsx'
import Tag from '../components/Tag.tsx'
import ScribbleTitle from '../components/ScribbleTitle.tsx'

function arrayToString(arr: string[]) {
  return arr.join('\n')
}

function stringToArray(str: string) {
  return str
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
}

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-|-$/g, '')
}

function generateId() {
  return `cafe-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

interface FormData {
  cafe: CafeInput
  districts: District[]
  setCafe: (cafe: CafeInput) => void
  onSave: (cafe: CafeInput) => void
  onCancel: () => void
}

function makeEmptyCafe(districtSlug: string): CafeInput {
  return {
    id: '',
    name: '',
    slug: '',
    district: districtSlug,
    address: '',
    hours: '',
    tags: [],
    rating: 4.5,
    priceRange: '¥30-50',
    signatureDrinks: [],
    tips: [],
    vibe: '',
    description: '',
    imagePrompt: '',
    recommendation: '',
  }
}

function CafeForm({ cafe, districts, setCafe, onSave, onCancel }: FormData) {
  const update = <K extends keyof CafeInput>(key: K, value: CafeInput[K]) => {
    setCafe({ ...cafe, [key]: value })
  }

  return (
    <div className="fixed inset-0 z-50 bg-ink/40 flex items-center justify-center p-4 overflow-y-auto">
      <WobblyCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 bg-paper-light" rotate={0}>
        <div className="flex items-center justify-between mb-4">
          <ScribbleTitle as="h2" className="text-2xl">
            {cafe.id ? '编辑咖啡馆' : '新增咖啡馆'}
          </ScribbleTitle>
          <button onClick={onCancel} className="p-1 hover:text-red">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-body mb-1">店名</label>
            <input
              value={cafe.name}
              onChange={(e) => {
                const name = e.target.value
                setCafe({ ...cafe, name, slug: cafe.slug || generateSlug(name) })
              }}
              className="w-full px-3 py-2 bg-paper border-2 border-ink/20 rounded-wobbly-sm focus:outline-none focus:border-red"
            />
          </div>

          <div>
            <label className="block text-sm font-body mb-1">Slug</label>
            <input
              value={cafe.slug}
              onChange={(e) => update('slug', e.target.value)}
              className="w-full px-3 py-2 bg-paper border-2 border-ink/20 rounded-wobbly-sm focus:outline-none focus:border-red"
            />
          </div>

          <div>
            <label className="block text-sm font-body mb-1">街区</label>
            <select
              value={cafe.district}
              onChange={(e) => update('district', e.target.value)}
              className="w-full px-3 py-2 bg-paper border-2 border-ink/20 rounded-wobbly-sm focus:outline-none focus:border-red"
            >
              {districts.map((d) => (
                <option key={d.id} value={d.slug}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-body mb-1">营业时间</label>
            <input
              value={cafe.hours}
              onChange={(e) => update('hours', e.target.value)}
              placeholder="10:00 - 22:00"
              className="w-full px-3 py-2 bg-paper border-2 border-ink/20 rounded-wobbly-sm focus:outline-none focus:border-red"
            />
          </div>

          <div>
            <label className="block text-sm font-body mb-1">人均消费</label>
            <input
              value={cafe.priceRange}
              onChange={(e) => update('priceRange', e.target.value)}
              placeholder="¥30-50"
              className="w-full px-3 py-2 bg-paper border-2 border-ink/20 rounded-wobbly-sm focus:outline-none focus:border-red"
            />
          </div>

          <div>
            <label className="block text-sm font-body mb-1">评分</label>
            <input
              type="number"
              min={0}
              max={5}
              step={0.1}
              value={cafe.rating}
              onChange={(e) => update('rating', Number(e.target.value))}
              className="w-full px-3 py-2 bg-paper border-2 border-ink/20 rounded-wobbly-sm focus:outline-none focus:border-red"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-body mb-1">地址</label>
            <input
              value={cafe.address}
              onChange={(e) => update('address', e.target.value)}
              className="w-full px-3 py-2 bg-paper border-2 border-ink/20 rounded-wobbly-sm focus:outline-none focus:border-red"
            />
          </div>

          <div>
            <label className="block text-sm font-body mb-1">标签（每行一个）</label>
            <textarea
              value={arrayToString(cafe.tags)}
              onChange={(e) => update('tags', stringToArray(e.target.value))}
              rows={3}
              className="w-full px-3 py-2 bg-paper border-2 border-ink/20 rounded-wobbly-sm focus:outline-none focus:border-red"
            />
          </div>

          <div>
            <label className="block text-sm font-body mb-1">招牌饮品（每行一个）</label>
            <textarea
              value={arrayToString(cafe.signatureDrinks)}
              onChange={(e) => update('signatureDrinks', stringToArray(e.target.value))}
              rows={3}
              className="w-full px-3 py-2 bg-paper border-2 border-ink/20 rounded-wobbly-sm focus:outline-none focus:border-red"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-body mb-1">探店小贴士（每行一条）</label>
            <textarea
              value={arrayToString(cafe.tips)}
              onChange={(e) => update('tips', stringToArray(e.target.value))}
              rows={3}
              className="w-full px-3 py-2 bg-paper border-2 border-ink/20 rounded-wobbly-sm focus:outline-none focus:border-red"
            />
          </div>

          <div>
            <label className="block text-sm font-body mb-1">一句话推荐</label>
            <input
              value={cafe.recommendation}
              onChange={(e) => update('recommendation', e.target.value)}
              className="w-full px-3 py-2 bg-paper border-2 border-ink/20 rounded-wobbly-sm focus:outline-none focus:border-red"
            />
          </div>

          <div>
            <label className="block text-sm font-body mb-1">氛围</label>
            <input
              value={cafe.vibe}
              onChange={(e) => update('vibe', e.target.value)}
              className="w-full px-3 py-2 bg-paper border-2 border-ink/20 rounded-wobbly-sm focus:outline-none focus:border-red"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-body mb-1">简介</label>
            <textarea
              value={cafe.description}
              onChange={(e) => update('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-paper border-2 border-ink/20 rounded-wobbly-sm focus:outline-none focus:border-red"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-body mb-1">图片生成 Prompt</label>
            <textarea
              value={cafe.imagePrompt}
              onChange={(e) => update('imagePrompt', e.target.value)}
              rows={3}
              placeholder="用英文描述想要的咖啡馆场景"
              className="w-full px-3 py-2 bg-paper border-2 border-ink/20 rounded-wobbly-sm focus:outline-none focus:border-red font-mono text-xs"
            />
            {cafe.imagePrompt && (
              <div className="mt-2 h-32 rounded-wobbly-sm overflow-hidden border-2 border-ink/20">
                <img
                  src={buildImageUrl(cafe.imagePrompt)}
                  alt="预览"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 border-2 border-ink rounded-wobbly-sm font-body hover:bg-paper"
          >
            取消
          </button>
          <button
            onClick={() => onSave(cafe)}
            className="px-4 py-2 bg-red text-paper border-2 border-red rounded-wobbly-sm font-body flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            保存
          </button>
        </div>
      </WobblyCard>
    </div>
  )
}

export default function Admin() {
  const [cafes, setCafes] = useState<CafeInput[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<CafeInput | null>(null)
  const { districts, loading: districtsLoading } = useDistricts()

  const emptyCafe = useMemo(() => makeEmptyCafe(districts[0]?.slug ?? ''), [districts])

  const load = async () => {
    setLoading(true)
    try {
      const data = await getCafeInputs()
      setCafes(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const sortedCafes = useMemo(() => {
    return [...cafes].sort((a, b) => a.district.localeCompare(b.district, 'zh-CN'))
  }, [cafes])

  const handleSave = async (cafe: CafeInput) => {
    try {
      if (!cafe.id) {
        await createCafe({ ...cafe, id: generateId() })
      } else {
        await updateCafe(cafe.id, cafe)
      }
      await load()
      setEditing(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err))
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这家咖啡馆吗？')) return
    try {
      await deleteCafe(id)
      await load()
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err))
    }
  }

  const handleExport = () => {
    const data = JSON.stringify(cafes, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'cafes.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleReset = async () => {
    if (!confirm('重置会丢失当前编辑内容，确定要恢复默认数据吗？')) return
    try {
      await resetCafes()
      await load()
      setEditing(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err))
    }
  }

  if (loading || districtsLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-ink/20 border-t-red rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center text-red">
        <p>加载失败：{error}</p>
        <p className="text-sm text-ink-soft mt-2">请确认后端服务是否已启动</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <ScribbleTitle as="h1" className="text-3xl">数据管理</ScribbleTitle>
          <p className="text-sm text-ink-soft mt-1">
            共 {cafes.length} 家咖啡馆 · 数据保存在后端 api/data/cafes.json
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setEditing({ ...emptyCafe })}
            className="px-4 py-2 bg-green text-paper border-2 border-green rounded-wobbly-sm font-body flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            新增
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-ink text-paper border-2 border-ink rounded-wobbly-sm font-body flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            导出 JSON
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-paper-light text-ink border-2 border-ink rounded-wobbly-sm font-body flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            重置
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {sortedCafes.map((cafe) => (
          <WobblyCard key={cafe.id} className="p-4" rotate={0}>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-wobbly-sm overflow-hidden border-2 border-ink/20 flex-shrink-0">
                <img
                  src={buildImageUrl(cafe.imagePrompt)}
                  alt={cafe.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-xl">{cafe.name}</h3>
                    <p className="text-sm text-ink-soft">{cafe.address}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditing({ ...cafe })}
                      className="p-2 hover:bg-paper rounded-wobbly-sm"
                      aria-label="编辑"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cafe.id)}
                      className="p-2 hover:bg-red/10 text-red rounded-wobbly-sm"
                      aria-label="删除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {cafe.tags.map((tag) => (
                    <Tag key={tag} variant="brown">
                      {tag}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>
          </WobblyCard>
        ))}
      </div>

      {editing && (
        <CafeForm
          cafe={editing}
          districts={districts}
          setCafe={setEditing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  )
}
