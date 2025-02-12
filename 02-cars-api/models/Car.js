// 1. Importo mongoose
import mongoose from 'mongoose'

// 2. Defino el schema de mongoose
const carSchema = new mongoose.Schema({

})

// 3. Creo el modelo de mongoose y lo exporto
const Car = mongoose.model('Car', carSchema)

export default Car
