import type { Cafe, CafeInput, District } from '../data/types'
import { resolveCafeImages } from './images'

const API_BASE = '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, options)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Request failed: ${res.status}`)
  }
  if (res.status === 204) {
    return undefined as T
  }
  return res.json() as Promise<T>
}

export async function getCafeInputs(): Promise<CafeInput[]> {
  return request<CafeInput[]>('/cafes')
}

export async function resetCafes(): Promise<CafeInput[]> {
  return request<CafeInput[]>('/reset', { method: 'POST' })
}

export async function getCafes(): Promise<Cafe[]> {
  const inputs = await request<CafeInput[]>('/cafes')
  return resolveCafeImages(inputs)
}

export async function getCafe(slug: string): Promise<Cafe | null> {
  const input = await request<CafeInput>(`/cafes/${slug}`)
  return resolveCafeImages([input])[0] ?? null
}

export async function getDistricts(): Promise<District[]> {
  return request<District[]>('/districts')
}

export async function createCafe(cafe: CafeInput): Promise<Cafe> {
  const input = await request<CafeInput>('/cafes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cafe),
  })
  return resolveCafeImages([input])[0]
}

export async function updateCafe(id: string, cafe: CafeInput): Promise<Cafe> {
  const input = await request<CafeInput>(`/cafes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cafe),
  })
  return resolveCafeImages([input])[0]
}

export async function deleteCafe(id: string): Promise<void> {
  await request<void>(`/cafes/${id}`, { method: 'DELETE' })
}
