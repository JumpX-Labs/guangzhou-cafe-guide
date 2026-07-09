import { Router } from 'express'
import { createDbClient } from '../lib/db.ts'
import type { CafeInput } from '../types.ts'

const url = process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !serviceRoleKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
}

const db = createDbClient(url, serviceRoleKey)

const router = Router()

router.get('/districts', async (_req, res) => {
  try {
    const districts = await db.readDistricts()
    res.json(districts)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

router.get('/cafes', async (_req, res) => {
  try {
    const cafes = await db.readCafes()
    res.json(cafes)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

router.get('/cafes/:slug', async (req, res) => {
  try {
    const cafe = await db.readCafeBySlug(req.params.slug)
    if (!cafe) {
      res.status(404).json({ error: 'Cafe not found' })
      return
    }
    res.json(cafe)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

router.post('/cafes', async (req, res) => {
  try {
    const newCafe = req.body as CafeInput

    if (!newCafe.name || !newCafe.slug) {
      res.status(400).json({ error: 'name and slug are required' })
      return
    }

    const existing = await db.readCafeBySlug(newCafe.slug)
    if (existing) {
      res.status(409).json({ error: 'slug already exists' })
      return
    }

    const cafe = await db.createCafe(newCafe)
    res.status(201).json(cafe)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

router.put('/cafes/:id', async (req, res) => {
  try {
    const existing = await db.readCafeById(req.params.id)
    if (!existing) {
      res.status(404).json({ error: 'Cafe not found' })
      return
    }
    const updated = { ...existing, ...req.body, id: req.params.id } as CafeInput
    const cafe = await db.updateCafe(req.params.id, updated)
    res.json(cafe)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

router.delete('/cafes/:id', async (req, res) => {
  try {
    await db.deleteCafe(req.params.id)
    res.status(204).send()
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

router.post('/reset', async (_req, res) => {
  try {
    const seed = (await import('../data/seed.json', { with: { type: 'json' } })).default as CafeInput[]
    const cafes = await db.resetCafes(seed)
    res.json(cafes)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

export default router
