// ===================== WEEK 1 ASSIGNMENT (MongoDB Atlas) =====================
require('dotenv').config();
const mongoose = require('mongoose');

// -------------------- DB CONNECTION --------------------
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODBATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB Atlas');
  } catch (err) {
    console.error('❌ DB Connection Error:', err.message);
  }
}

// -------------------- BOOK MODEL --------------------
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  genre: String,
  published_year: Number,
  price: Number,
  in_stock: Boolean,
  pages: Number,
  publisher: String
});

const Book = mongoose.model('Book', bookSchema);

// -------------------- TASK 1: Insert Sample Books --------------------
const books = [
  { title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Fiction', published_year: 1960, price: 12.99, in_stock: true, pages: 336, publisher: 'J. B. Lippincott & Co.' },
  { title: '1984', author: 'George Orwell', genre: 'Dystopian', published_year: 1949, price: 10.99, in_stock: true, pages: 328, publisher: 'Secker & Warburg' },
  { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Fiction', published_year: 1925, price: 9.99, in_stock: true, pages: 180, publisher: "Charles Scribner's Sons" },
  { title: 'Brave New World', author: 'Aldous Huxley', genre: 'Dystopian', published_year: 1932, price: 11.50, in_stock: false, pages: 311, publisher: 'Chatto & Windus' },
  { title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy', published_year: 1937, price: 14.99, in_stock: true, pages: 310, publisher: 'George Allen & Unwin' },
  { title: 'Pride and Prejudice', author: 'Jane Austen', genre: 'Romance', published_year: 1813, price: 7.99, in_stock: true, pages: 432, publisher: 'T. Egerton, Whitehall' },
  { title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', genre: 'Fantasy', published_year: 1954, price: 19.99, in_stock: true, pages: 1178, publisher: 'Allen & Unwin' },
  { title: 'Animal Farm', author: 'George Orwell', genre: 'Political Satire', published_year: 1945, price: 8.50, in_stock: false, pages: 112, publisher: 'Secker & Warburg' },
  { title: 'The Alchemist', author: 'Paulo Coelho', genre: 'Fiction', published_year: 1988, price: 10.99, in_stock: true, pages: 197, publisher: 'HarperOne' },
  { title: 'Moby Dick', author: 'Herman Melville', genre: 'Adventure', published_year: 1851, price: 12.50, in_stock: false, pages: 635, publisher: 'Harper & Brothers' }
];

// -------------------- TASK 2-5: Functions --------------------
async function runAssignment() {
  try {
    await connectDB();

    // ----- TASK 1: Insert Books -----
    await Book.deleteMany({});
    await Book.insertMany(books);
    console.log('✅ Task 1: Sample books inserted');

    // ----- TASK 2: CRUD -----
    const newBook = await Book.create({ title: "Clean Code", author: "Robert C. Martin", genre: "Programming", published_year: 2008, price: 25.99, in_stock: true, pages: 464, publisher: "Prentice Hall" });
    console.log('✅ Task 2: Created Book:', newBook.title);

    const allBooks = await Book.find().select("title author published_year");
    console.log('📚 Task 2: All Books:', allBooks.map(b => b.title));

    await Book.updateOne({ title: "Clean Code" }, { price: 30.99 });
    console.log('✏️ Task 2: Updated Clean Code price');

    await Book.deleteOne({ title: "Clean Code" });
    console.log('🗑️ Task 2: Deleted Clean Code');

    // ----- TASK 3: Advanced Queries -----
    const inStockAfter2010 = await Book.find({ in_stock: true, published_year: { $gt: 2010 } }).select("title author price");
    console.log('🔍 Task 3: In-stock books after 2010:', inStockAfter2010);

    const sortedAsc = await Book.find().sort({ price: 1 }).limit(5);
    console.log('⬆️ Task 3: Books by Price Asc:', sortedAsc.map(b => b.title));

    const sortedDesc = await Book.find().sort({ price: -1 }).limit(5);
    console.log('⬇️ Task 3: Books by Price Desc:', sortedDesc.map(b => b.title));

    const page2 = await Book.find().skip(5).limit(5);
    console.log('📄 Task 3: Page 2 Books:', page2.map(b => b.title));

    // ----- TASK 4: Aggregation -----
    const booksPerAuthor = await Book.aggregate([{ $group: { _id: "$author", totalBooks: { $sum: 1 } } }]);
    console.log('📊 Task 4: Books per Author:', booksPerAuthor);

    const avgPriceByGenre = await Book.aggregate([{ $group: { _id: "$genre", avgPrice: { $avg: "$price" } } }]);
    console.log('💸 Task 4: Average Price by Genre:', avgPriceByGenre);

    const booksByDecade = await Book.aggregate([
      { $project: { decade: { $multiply: [{ $floor: { $divide: ["$published_year", 10] } }, 10] } } },
      { $group: { _id: "$decade", totalBooks: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    console.log('📚 Task 4: Books by Decade:', booksByDecade);

    // ----- TASK 5: Indexing -----
    await Book.collection.createIndex({ title: 1 });
    await Book.collection.createIndex({ author: 1, published_year: -1 });
    console.log('✅ Task 5: Indexes created');

    const explainTitle = await Book.find({ title: "1984" }).explain("executionStats");
    console.log('🔍 Task 5: Explain query on title "1984":', explainTitle.executionStats.totalDocsExamined, 'docs examined');

  } catch (err) {
    console.error('❌ Assignment Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB Atlas');
  }
}

// -------------------- RUN --------------------
runAssignment();
