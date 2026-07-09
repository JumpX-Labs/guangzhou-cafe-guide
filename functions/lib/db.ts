import { createClient } from '@supabase/supabase-js'

export interface CafeBase {
  id: string
  name: string
  slug: string
  district: string
  address: string
  hours: string
  tags: string[]
  rating: number
  priceRange: string
  signatureDrinks: string[]
  tips: string[]
  vibe: string
  description: string
  recommendation: string
}

export interface CafeInput extends CafeBase {
  imagePrompt: string
}

export interface District {
  id: string
  name: string
  slug: string
  description: string
  position: { x: number; y: number }
}

export function createDbClient(url: string, serviceRoleKey: string) {
  const supabase = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  async function readCafes(): Promise<CafeInput[]> {
    const { data, error } = await supabase.from('cafes').select('*').order('name', { ascending: true })
    if (error) throw error
    return (data ?? []).map(toCafeInput)
  }

  async function readCafeBySlug(slug: string): Promise<CafeInput | null> {
    const { data, error } = await supabase.from('cafes').select('*').eq('slug', slug).single()
    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return data ? toCafeInput(data) : null
  }

  async function readCafeById(id: string): Promise<CafeInput | null> {
    const { data, error } = await supabase.from('cafes').select('*').eq('id', id).single()
    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return data ? toCafeInput(data) : null
  }

  async function createCafe(cafe: CafeInput): Promise<CafeInput> {
    const { data, error } = await supabase.from('cafes').insert(toDbCafe(cafe)).select().single()
    if (error) throw error
    return toCafeInput(data)
  }

  async function updateCafe(id: string, cafe: CafeInput): Promise<CafeInput> {
    const { error } = await supabase.from('cafes').update(toDbCafe(cafe)).eq('id', id)
    if (error) throw error
    const updated = await readCafeById(id)
    if (!updated) throw new Error('Cafe not found after update')
    return updated
  }

  async function deleteCafe(id: string): Promise<void> {
    const { error } = await supabase.from('cafes').delete().eq('id', id)
    if (error) throw error
  }

  async function readDistricts(): Promise<District[]> {
    const { data, error } = await supabase.from('districts').select('*').order('name', { ascending: true })
    if (error) throw error
    return (data ?? []).map(toDistrict)
  }

  async function resetCafes(seed: CafeInput[]): Promise<CafeInput[]> {
    await supabase.from('cafes').delete().neq('id', '')
    const { data, error } = await supabase.from('cafes').insert(seed.map(toDbCafe)).select()
    if (error) throw error
    return (data ?? []).map(toCafeInput)
  }

  return {
    readCafes,
    readCafeBySlug,
    readCafeById,
    createCafe,
    updateCafe,
    deleteCafe,
    readDistricts,
    resetCafes,
  }
}

function toDbCafe(cafe: CafeInput) {
  return {
    id: cafe.id,
    name: cafe.name,
    slug: cafe.slug,
    district: cafe.district,
    address: cafe.address,
    hours: cafe.hours,
    tags: cafe.tags,
    rating: cafe.rating,
    price_range: cafe.priceRange,
    signature_drinks: cafe.signatureDrinks,
    tips: cafe.tips,
    vibe: cafe.vibe,
    description: cafe.description,
    image_prompt: cafe.imagePrompt,
    recommendation: cafe.recommendation,
  }
}

function toCafeInput(row: Record<string, unknown>): CafeInput {
  return {
    id: String(row.id),
    name: String(row.name),
    slug: String(row.slug),
    district: String(row.district),
    address: String(row.address),
    hours: String(row.hours),
    tags: Array.isArray(row.tags) ? row.tags.map(String) : [],
    rating: Number(row.rating),
    priceRange: String(row.price_range),
    signatureDrinks: Array.isArray(row.signature_drinks) ? row.signature_drinks.map(String) : [],
    tips: Array.isArray(row.tips) ? row.tips.map(String) : [],
    vibe: String(row.vibe),
    description: String(row.description),
    imagePrompt: String(row.image_prompt),
    recommendation: String(row.recommendation),
  }
}

function toDistrict(row: Record<string, unknown>): District {
  return {
    id: String(row.id),
    name: String(row.name),
    slug: String(row.slug),
    description: String(row.description),
    position: {
      x: Number(row.position_x),
      y: Number(row.position_y),
    },
  }
}
