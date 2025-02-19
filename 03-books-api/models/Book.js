import mongoose from 'mongoose'

const genreEnum = ['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Horror', 'Thriller', 'Romance', 'Western', 'Dystopian', 'Memoir', 'Biography', 'Autobiography', 'Self-Help', 'Historical', 'Poetry', 'Cookbook', 'Art', 'Science', 'History', 'Travel', 'Children', 'Young Adult', 'Other', 'Technical', 'Textbook']

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: String,
  genre: { type: String, required: true, enum: genreEnum },
  publishedDate: Date, // YYYY-MM-DD
  authors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Author' }], // ObjectId es un tipo de dato utilizado por MongoDB para identificar de forma única un documento en una colección. ref: 'Author' indica que el campo authors hace referencia a documentos de la colección Author
  publisher: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  imgUrl: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true }) // Agregar timestamps (createdAt, updatedAt) a cada documento

const Book = mongoose.model('Book', bookSchema)

export default Book
