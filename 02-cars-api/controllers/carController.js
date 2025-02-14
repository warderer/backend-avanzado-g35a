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
const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find()
    // const cars = await Car.find({}, { plate: 1, year: 1, model: 1, brand: 1 }) // Con proyecciones, para elegir solamente ciertos campos.
    res.status(200).json(cars)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.carId)
    res.status(200).json(car)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// UPDATE
const updateCarById = async (req, res) => {
  try {
    const updatedCar = await Car.findByIdAndUpdate(req.params.carId, req.body, { new: true }) // { new: true } para que devuelva el documento actualizado, en caso contrario devuelve el documento antes de actualizar.
    if (!updatedCar) return res.status(404).json({ message: 'Car not found' })
    res.status(200).json(updatedCar)
  } catch (error) {
    res.status(400).json({ message: 'Error Updating Car', error })
  }
}

// DELETE

export {
  createCar,
  getAllCars,
  getCarById,
  updateCarById
}
