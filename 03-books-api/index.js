import express from 'express'
import { connect } from './config/database.js'
import bookRoutes from './routes/bookRoutes.js'
import authRoutes from './routes/authRoutes.js'
import morgan from 'morgan'

const PORT = process.env.PORT || 3000

const app = express()
app.use(express.json())
// app.use(morgan('tiny'))

// Tokens personalizados de Morgan
morgan.token('type', function (req, res) { return req.headers['content-type'] })
morgan.token('body', req => JSON.stringify(req.body))
morgan.token('hostname', req => req.hostname)
morgan.token('query', req => JSON.stringify(req.query))
morgan.token('ip', req => req.ip)

app.use(morgan(':hostname :status :method :url :type :body :query - :response-time ms - :ip'))

// Aquí van las rutas
app.use('/api/v1/books', bookRoutes)
app.use('/api/v1', authRoutes)

// Levantar el servidor
connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} 🚀`)
  })
})
