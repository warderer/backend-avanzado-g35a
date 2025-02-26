/* eslint-disable camelcase */
import User from '../models/User.js'
import bcrypt from 'bcrypt'

// Registrar un nuevo usuario: Register
const register = async (req, res) => {
// Validar que el email, password, first_name y last_name vengan en el body
  const { first_name, last_name, email, password } = req.body
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: 'first_name, last_name, email and password are required' })
  }

  try {
    // Encriptar la contraseña con ayuda de bcrypt
    const saltRounds = 10 // No. de veces que se aplica el algoritmo de encriptación
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Reemplazar la contraseña en texto plano del body por la contraseña encriptada
    req.body.password = hashedPassword

    // Creo un nuevo usuario en la base de datos
    const newUser = await User.create(req.body)

    // PERO.... debemos eliminar la contraseña del objeto de respuesta, por motivos de seguridad. Mongo ignora las propiedades que tienen el valor 'undefined', por lo que podemos hacer lo siguiente:
    newUser.password = undefined

    return res.status(201).json(newUser)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

// Iniciar sesión: Login

export {
  register
}
