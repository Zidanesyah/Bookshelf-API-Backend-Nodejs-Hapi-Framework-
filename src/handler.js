const { nanoid } = require('nanoid');
const books = require('./books');

const addBook = (req, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.payload;

    // Validasi: nama buku wajib diisi
    if (!name) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        }).code(400);
    }

    // Validasi: readPage tidak boleh lebih besar dari pageCount
    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        }).code(400);
    }

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
    };
    books.push(newBook);

    const isSuccess = books.some((book) => book.id === id);

    if (isSuccess) {
        return h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            }
        }).code(201);
    }

    // Jika gagal karena alasan lain (misal gagal push ke array)
    return h.response({
        status: 'error',
        message: 'Buku gagal ditambahkan'
    }).code(500);
}


const getBooks = (req, h) => {
    let filteredBooks = books;

    // Filter by name
    if (req.query.name) {
        const nameQuery = req.query.name.toLowerCase();
        filteredBooks = filteredBooks.filter(book => book.name.toLowerCase().includes(nameQuery));
    }

    // Filter by reading
    if (req.query.reading !== undefined) {
        const reading = req.query.reading === '1';
        filteredBooks = filteredBooks.filter(book => book.reading === reading);
    }

    // Filter by finished
    if (req.query.finished !== undefined) {
        const finished = req.query.finished === '1';
        filteredBooks = filteredBooks.filter(book => book.finished === finished);
    }

    return h.response({
        status: 'success',
        data: {
            books: filteredBooks.map(({ id, name, publisher }) => ({
                id,
                name,
                publisher
            })),
        }
    }).code(200);
};


const getBookById = (req, h) =>{
    const {id} = req.params;

    const book = books.find((book) => book.id === id);

    if(book !== undefined){
        return h.response({
            status: 'success',
            data:{
                book: book,
            }
        }).code(200);
    }else{
        return h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan'
        }).code(404);
    }
}

const updateBook = (req, h) => {
    const {id} = req.params;

    const {name, year, author, summary, publisher, pageCount, readPage, reading} = req.payload;

    if(!name){
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        }).code(400);
    }

    if(readPage > pageCount){
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        }).code(400);
    }

    const index = books.findIndex((book) => book.id === id);

    if(index !== -1){
        books[index] = {
            ...books[index],
            name, year, author, summary, publisher, pageCount, readPage, reading
        }

        return h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui'
        }).code(200);
    }

    return h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
    }).code(404);

}

const deleteBook = (req, h) =>{
    const {id} = req.params;
    const index = books.findIndex((book) => book.id === id);

    if(index !== -1){
        books.splice(index, 1);
        return h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        }).code(200);
    }

    return h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
    }).code(404);
}

module.exports = {addBook, getBooks, getBookById, updateBook, deleteBook};