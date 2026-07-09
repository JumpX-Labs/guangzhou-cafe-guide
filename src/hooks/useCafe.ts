import { useEffect, useState } from 'react'
import type { Cafe } from '../data/types'
import { getCafe } from '../lib/api.ts'

export function useCafe(slug: string | undefined) {
  const [cafe, setCafe] = useState<Cafe | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) {
      setLoading(false)
      return
    }
    setLoading(true)
    getCafe(slug)
      .then(setCafe)
      .catch((err) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false))
  }, [slug])

  return { cafe, loading, error }
}
