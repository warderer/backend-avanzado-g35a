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
    const cars = await Car.find({ isActive: true }) // isActive: true -> Para hacer funcionar el borrado lógico.
    // const cars = await Car.find({}, { plate: 1, year: 1, model: 1, brand: 1 }) // Con proyecciones, para elegir solamente ciertos campos.
    res.status(200).json(cars)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const getCarById = async (req, res) => {
  try {
    const car = await Car.find({ _id: req.params.carId, isActive: true }) // isActive: true -> Para hacer funcionar el borrado lógico.
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
const deleteCarById = async (req, res) => {
  // Borrado Físico: Voy a comprobar si existe un query string llamado 'destroy' y si su valor es 'true', voy a borrar el documento(registro) de la base de datos. /?destroy=true
  if (req.query.destroy === 'true') {
    try {
      const deletedCar = await Car.findByIdAndDelete(req.params.carId)
      if (deletedCar === null) return res.status(404).json({ message: 'Cannot Delete: Car not found' })
      return res.status(204).json()
    } catch (error) {
      res.status(400).json({ message: 'Error Deleting Car', error })
    }
  }

  // Borrado Lógico: Cambio el estaod de isActive a false (Update -> findByIdAndUpdate)
  try {
    const updatedCar = await Car.findByIdAndUpdate(req.params.carId, { isActive: false }, { new: false })
    if (updatedCar === null || updatedCar.isActive === false) return res.status(404).json({ message: 'Cannot Delete: Car not found' })
    return res.status(204).json()
  } catch (error) {
    res.status(400).json({ message: 'Error Deleting Car', error })
  }
}

export {
  createCar,
  getAllCars,
  getCarById,
  updateCarById,
  deleteCarById
}
