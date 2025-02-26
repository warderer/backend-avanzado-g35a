const isAdmin = (req, res, next) => {
  if (req.role !== 'ADMIN') {
    return res.status(403).json({ message: 'You do not have permission to access this resource' })
  }
  next()
}

export { isAdmin }
