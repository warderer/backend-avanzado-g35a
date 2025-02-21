import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ['ADMIN', 'USER'],
    default: 'USER'
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

export default mongoose.model('User', userSchema)
