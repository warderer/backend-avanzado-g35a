import Car from '../models/Car.js'

// CREATE
const createCar = async (req, res) => {
  try {
    const newCar = await Car.create(req.body)
    res.status(201).json(newCar)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// READ

// UPDATE

// DELETE

export {
  createCar
}
