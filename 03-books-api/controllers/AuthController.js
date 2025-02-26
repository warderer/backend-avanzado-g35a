/* eslint-disable camelcase */
import User from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jwt-simple'

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
const login = async (req, res) => {
  // Validar que el email y el password vengan en el body
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' })
  }

  try {
    // Buscar el usuario proprorcionado en la base de datos
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    // Si el correo existe, entonces comparamos la contraseña proporcionada con la contraseña almacenada en la base de datos

    const isValidPassword = await bcrypt.compare(
      password, user.password
    ) // Esto devuelve un booleano - true o false

    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    // Si el correo existe y la contraseña es correcta, entonces generaremos un token de autenticación (JWT)

    // Construimos el payload del token
    const payload = {
      _id: user._id,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000), // Fecha de emisión del token
      exp: Math.floor(Date.now() / 1000 + (60 * 60 * 24 * 7)) // Fecha de expiración del token
    }

    // Construyo el token con el método encode de jwt-simple y la clave se creta
    const token = jwt.encode(payload, process.env.JWT_SECRET)

    // Devolvemos el token al cliente
    return res.status(200).json({ token })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export {
  register,
  login
}
