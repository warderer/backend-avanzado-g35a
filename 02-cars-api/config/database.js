import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config() // Leemos las variables de entorno .ENV

const connect = async () => {
  try {
    mongoose.connect(process.env.DB_CONNECT_URI) // Nos conectamos a la base de datos
    const { connection } = await mongoose // Traemos la conexión de mongoose para ver si hay errores

    connection.once('open', () => {
      console.log('✅ Database connected ')
    })

    connection.on('error', (error) => {
      console.log('❌ Database connection error: ', error)
    })
  } catch (error) {
    console.log('🍿 Error connecting to the database: ', error)
  }
}

export { connect }
