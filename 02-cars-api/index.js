import express from 'express'

const PORT = process.env.PORT || 3000

const app = express()
app.use(express.json())

// Aquí van las rutas

app.listen(PORT, () => {
  console.log(`API running on port: ${PORT} 🚀`)
})
