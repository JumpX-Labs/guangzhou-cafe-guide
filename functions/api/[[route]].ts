import { Hono } from 'hono'
import { handle } from 'hono/cloudflare-pages'
import { createDbClient, type CafeInput } from '../lib/db.ts'
import seed from '../data/seed.json'

type Env = {
  SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY: string
}

const app = new Hono<{ Bindings: Env }>().basePath('/api')

app.use('*', async (c, next) => {
  c.header('Access-Control-Allow-Origin', '*')
  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  c.header('Access-Control-Allow-Headers', 'Content-Type')
  if (c.req.method === 'OPTIONS') {
    return c.text('', 204)
  }
  await next()
})

function getDb(c: { env: Env }) {
  const url = c.env.SUPABASE_URL
  const key = c.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  }
  return createDbClient(url, key)
}

app.get('/districts', async (c) => {
  try {
    const db = getDb(c)
    const districts = await db.readDistricts()
    return c.json(districts)
  } catch (err) {
    return c.json({ error: (err as Error).message }, 500)
  }
})

app.get('/cafes', async (c) => {
  try {
    const db = getDb(c)
    const cafes = await db.readCafes()
    return c.json(cafes)
  } catch (err) {
    return c.json({ error: (err as Error).message }, 500)
  }
})

app.get('/cafes/:slug', async (c) => {
  try {
    const db = getDb(c)
    const slug = c.req.param('slug')
    const cafe = await db.readCafeBySlug(slug)
    if (!cafe) return c.json({ error: 'Cafe not found' }, 404)
    return c.json(cafe)
  } catch (err) {
    return c.json({ error: (err as Error).message }, 500)
  }
})

app.post('/cafes', async (c) => {
  try {
    const db = getDb(c)
    const newCafe = await c.req.json<CafeInput>()
    if (!newCafe.name || !newCafe.slug) {
      return c.json({ error: 'name and slug are required' }, 400)
    }
    const existing = await db.readCafeBySlug(newCafe.slug)
    if (existing) {
      return c.json({ error: 'slug already exists' }, 409)
    }
    const cafe = await db.createCafe(newCafe)
    return c.json(cafe, 201)
  } catch (err) {
    return c.json({ error: (err as Error).message }, 500)
  }
})

app.put('/cafes/:id', async (c) => {
  try {
    const db = getDb(c)
    const id = c.req.param('id')
    const existing = await db.readCafeById(id)
    if (!existing) {
      return c.json({ error: 'Cafe not found' }, 404)
    }
    const body = await c.req.json<Partial<CafeInput>>()
    const updated = { ...existing, ...body, id } as CafeInput
    const cafe = await db.updateCafe(id, updated)
    return c.json(cafe)
  } catch (err) {
    return c.json({ error: (err as Error).message }, 500)
  }
})

app.delete('/cafes/:id', async (c) => {
  try {
    const db = getDb(c)
    await db.deleteCafe(c.req.param('id'))
    return c.text('', 204)
  } catch (err) {
    return c.json({ error: (err as Error).message }, 500)
  }
})

app.post('/reset', async (c) => {
  try {
    const db = getDb(c)
    const cafes = await db.resetCafes(seed as CafeInput[])
    return c.json(cafes)
  } catch (err) {
    return c.json({ error: (err as Error).message }, 500)
  }
})

export const onRequest = handle(app)
