import Author from '../models/Author.js'
import Book from '../models/Book.js'

// CREATE
const createBook = async (req, res) => {
  const bookData = req.body

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

// UPDATE

// DELETE

export {
  createBook
}
