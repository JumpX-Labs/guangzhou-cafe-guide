import { useEffect, useState } from 'react'
import type { Cafe } from '../data/types'
import { getCafes } from '../lib/api.ts'

export function useCafes() {
  const [cafes, setCafes] = useState<Cafe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = async () => {
    const data = await getCafes()
    setCafes(data)
    return data
  }

  useEffect(() => {
    setLoading(true)
    getCafes()
      .then(setCafes)
      .catch((err) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false))
  }, [])

  return { cafes, loading, error, refresh }
}
