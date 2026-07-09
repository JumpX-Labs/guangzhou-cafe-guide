import { createClient } from '@supabase/supabase-js'
import cafes from '../data/cafes.json' with { type: 'json' }
import districts from '../data/districts.json' with { type: 'json' }

const url = process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceRoleKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

type CafeJson = (typeof cafes)[number]
type DistrictJson = (typeof districts)[number]

function toDbCafe(cafe: CafeJson) {
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

function toDbDistrict(district: DistrictJson) {
  return {
    id: district.id,
    name: district.name,
    slug: district.slug,
    description: district.description,
    position_x: district.position.x,
    position_y: district.position.y,
  }
}

async function seed() {
  console.log('Truncating existing data...')
  const { error: deleteCafesError } = await supabase.from('cafes').delete().neq('id', '')
  if (deleteCafesError) throw deleteCafesError
  const { error: deleteDistrictsError } = await supabase.from('districts').delete().neq('id', '')
  if (deleteDistrictsError) throw deleteDistrictsError

  console.log(`Inserting ${districts.length} districts...`)
  const { error: districtsError } = await supabase.from('districts').insert(districts.map(toDbDistrict))
  if (districtsError) throw districtsError

  console.log(`Inserting ${cafes.length} cafes...`)
  const { error: cafesError } = await supabase.from('cafes').insert(cafes.map(toDbCafe))
  if (cafesError) throw cafesError

  console.log('Seed complete.')
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
