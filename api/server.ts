import express from 'express'
import cors from 'cors'
import { resolve } from 'node:path'
import cafeRoutes from './routes/cafes.ts'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/api', cafeRoutes)

// In production, serve the built frontend
const distPath = resolve(import.meta.dirname, '../dist')
app.use(express.static(distPath))
app.use((req, res, next) => {
  if (req.path.startsWith('/api/') || req.path === '/api') {
    res.status(404).json({ error: 'Not found' })
    return
  }
  res.sendFile(resolve(distPath, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`)
})
