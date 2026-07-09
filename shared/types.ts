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

export interface Cafe extends CafeBase {
  image: string
}

export interface District {
  id: string
  name: string
  slug: string
  description: string
  position: { x: number; y: number }
}
