import Author from '../models/Author.js'
import Book from '../models/Book.js'

// CREATE
const createBook = async (req, res) => {
  const bookData = req.body

  // VALIDACIONES
  // Validar que el body no venga vacío.
  if (Object.keys(bookData).length === 0) {
    return res.status(400).json({ message: 'No se recibió información' })
  }

  // Validar que Authors sea un arreglo
  if (!Array.isArray(bookData.authors)) {
    return res.status(400).json({ message: 'Authors debe ser un arreglo' })
  }

  // Validar que Authors tenga al menos un autor
  if (bookData.authors.length === 0) {
    return res.status(400).json({ message: 'El libro debe contener al menos un autor' })
  }

  // Crear autores, uno por uno y esperar a que todos se hayan creado en la colección de Authors
  try {
    const authorsModels = await Promise.all(
      bookData.authors.map(async author => {
        // Si el autor ya existe, devolverlo; si no crearlo y devolverlo.
        const existingAuthor = await Author.findOne({ firstName: author.firstName, lastName: author.lastName, birthDate: author.birthDate })

        if (existingAuthor) {
          return existingAuthor
        }

        // Si el autor no existe, se crea uno nuevo.
        const newAuthor = new Author(author)
        return await Author.create(newAuthor)
      }))
    // Como ya guardamos los autores, ya podemos asignarlos al libro. Y para ello necesitamos los ObjectId (_id) de los autores.
    bookData.authors = authorsModels.map(author => author._id)

    // Crear el libro con los ids de los autores
    const newBook = await Book.create(bookData)
    res.status(201).json(newBook)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// READ
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({ isActive: true }).populate('authors', 'firstName lastName bio birthDate')
    if (!books) {
      return res.status(404).json({ message: 'No se encontraron libros' })
    }
    res.status(200).json(books)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// UPDATE

// DELETE

export {
  createBook,
  getAllBooks
}
