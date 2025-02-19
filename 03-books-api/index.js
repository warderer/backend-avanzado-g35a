import express from 'express'

const PORT = process.env.PORT || 3000

const app = express()
app.use(express.json())

// Aquí van las rutas

// Levantar el servidor
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀`)
})
