/* -- MIDDLEWARES -- */
// Un Middleware es una función que se ejecuta antes de que se ejecute el controlador de una ruta. En este caso, el middleware isAuth se encargará de verificar si el usuario que está realizando la petición está autenticado o no. Si el usuario no está autenticado, entonces no podrá acceder a la información protegida.

import jwt from 'jwt-simple'

const isAuth = (req, res, next) => {
  // Obtener el encabezado de Authorization
  const authHeader = req.headers.authorization

  // Verificar si el encabezado de Authorization existe
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header is required' })
  }

  // Authorization: Bearer token
  // Separar el encabezado de Authorization, por medio de un arreglo, separandolo por el espacio en blanco.
  const [bearer, token] = authHeader.split(' ')

  // Verificar que el encabezado de Authorization comience con 'Bearer'
  if (bearer !== 'Bearer') {
    return res.status(401).json({ message: 'Invalid authorization header' })
  }

  // Verificar que el token no esté vacío
  if (!token) {
    return res.status(401).json({ message: 'Token is required' })
  }

  try {
    // Validar que el token sea válido y no este manipulado
    const payload = jwt.decode(token, process.env.JWT_SECRET)

    // Validar si el token ha expirado
    const now = Math.floor(Date.now() / 1000) // Fecha actual en segundos
    if (now > payload.exp) {
      return res.status(401).json({ message: 'Token has expired' })
    }

    // Valido el rol del usuario
    req.role = payload.role

    // Si el token es válido, entonces se ejecutará el siguiente middleware o Controlador de la ruta
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

export { isAuth }
