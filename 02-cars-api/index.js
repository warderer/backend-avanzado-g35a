import express from 'express'
import { connect } from './config/database.js'
import carRoutes from './routes/carRoutes.js'

const PORT = process.env.PORT || 3000

const app = express()
app.use(express.json())

// Aquí van las rutas
app.use('/api/v1', carRoutes)

connect().then(() => {
  app.listen(PORT, () => {
    console.log(`API running on port: ${PORT} 🚀`)
  })
})
