// 1. Importo mongoose
import mongoose from 'mongoose'

// 2. Defino el schema de mongoose
const carSchema = new mongoose.Schema({
  // Campo: tipo de dato || Campo: { tipo de dato, restricciones }
  plate: { type: String, required: true, unique: true }, // No. de Placa
  year: { type: Number, required: true }, // Año
  model: { type: String, required: true }, // Modelo
  brand: { type: String, required: true }, // Marca
  version: String,
  color: {
    type: String,
    required: true,
    enum: ['red', 'blue', 'black', 'white', 'silver', 'gray', 'green', 'yellow', 'orange', 'brown', 'purple', 'pink', 'gold']
  },
  carType: {
    type: String,
    required: true,
    enum: ['sedan', 'hatchback', 'suv', 'coupe', 'convertible', 'pickup', 'van', 'minivan', 'sport', 'luxury', 'crossover', 'hybrid', 'electric', 'wagon', 'classic', 'compact']
  },
  vin: { type: String, required: true, unique: true }, // Número de identificación del vehículo
  newCar: { type: Boolean, required: true }, // ¿Es un auto nuevo?
  isActive: { type: Boolean, default: true } // ¿Esta activo?
})

// 3. Creo el modelo de mongoose y lo exporto
// Siempre en singular y con mayúscula la primera letra. Mongoose pluraliza el nombre de la colección de la base de datos.
const Car = mongoose.model('Car', carSchema)

export default Car
