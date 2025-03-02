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

const getBookById = async (req, res) => {
  // Valido que el ID sea un ObjectId válido
  if (!req.params.bookId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: 'El ID del libro no es válido' })
  }

  try {
    const book = await Book
      .find({ _id: req.params.bookId, isActive: true })
      .populate('authors', 'firstName lastName bio birthDate')
    if (!book) {
      return res.status(404).json({ message: 'No se encontró el libro con el id especificado' })
    }
    return res.status(200).json(book)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// UPDATE
const updateBookById = async (req, res) => {
  // Valido que el ID sea un ObjectId válido (24 caracteres alfanumericos en hexadecimal)
  if (!req.params.bookId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: 'El ID del libro no es válido' })
  }

  try {
    const book = await Book
      .findByIdAndUpdate(req.params.bookId, req.body, { new: true })
      .populate('authors', 'firstName lastName bio birthDate')
    if (!book) {
      return res.status(404).json({ message: 'Error al actualizar, no se encontró el libro con el id especificado' })
    }
    res.status(200).json(book)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// DELETE
const deleteBookById = async (req, res) => {
  if (!req.params.bookId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: 'El ID del libro no es válido' })
  }
  // HARD DELETE: Borrado físico de la base de datos
  // Si recibo el query param ?destroy=true, borro el libro de la base de datos.
  if (req.query.destroy === 'true') {
    try {
      const book = await Book.findByIdAndDelete(req.params.bookId)
      if (!book) {
        return res.status(404).json({ message: 'No se encontró el libro con el id especificado' })
      }
      return res.status(204).end()
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }
  // SOFT DELETE: Cambiar el estado de isActive a false (update)
  try {
    const book = await Book
      .findByIdAndUpdate(req.params.bookId, { isActive: false }, { new: false })
    if (!book || !book.isActive) {
      return res.status(404).json({ message: 'Error al eliminar: No se encontró el libro con el id especificado' })
    }
    return res.status(204).end()
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export {
  createBook,
  getAllBooks,
  getBookById,
  updateBookById,
  deleteBookById
}
