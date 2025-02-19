import express from 'express'
import { connect } from './config/database.js'

const PORT = process.env.PORT || 3000

const app = express()
app.use(express.json())

// Aquí van las rutas

// Levantar el servidor
connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} 🚀`)
  })
})
