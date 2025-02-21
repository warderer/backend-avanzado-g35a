import express from 'express'
import { connect } from './config/database.js'
import bookRoutes from './routes/bookRoutes.js'
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

app.use(morgan(':hostname :status :method :url :type :body :query - :response-time ms'))

// Aquí van las rutas
app.use('/api/v1/books', bookRoutes)

// Levantar el servidor
connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} 🚀`)
  })
})
