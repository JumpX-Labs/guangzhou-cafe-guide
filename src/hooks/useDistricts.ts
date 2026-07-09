import { useEffect, useState } from 'react'
import type { District } from '../data/types'
import { getDistricts } from '../lib/api.ts'

export function useDistricts() {
  const [districts, setDistricts] = useState<District[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getDistricts()
      .then(setDistricts)
      .catch((err) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false))
  }, [])

  return { districts, loading, error }
}
