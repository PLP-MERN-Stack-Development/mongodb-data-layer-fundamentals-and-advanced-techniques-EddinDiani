// Import database connection
const { connectDB, mongoose } = require('./db');

// Define a Book schema & model
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  year: Number
});
const Book = mongoose.model("Book", bookSchema);

async function main() {
  try {
    // 1. CONNECT
    await connectDB();

    // 2. CREATE
    const newBook = await Book.create({
      title: "Clean Code",
      author: "Robert C. Martin",
      year: 2008
    });
    console.log("✅ Created Book:", newBook);

    // 3. READ (find all books)
    const allBooks = await Book.find().select("title author year");
    console.log("📚 All Books:", allBooks);

    // 4. UPDATE (change year of Clean Code)
    const updatedBook = await Book.findOneAndUpdate(
      { title: "Clean Code" },
      { year: 2010 },
      { new: true }
    );
    console.log("✏️ Updated Book:", updatedBook);

    // 5. DELETE (remove Clean Code)
    const deletedBook = await Book.findOneAndDelete({ title: "Clean Code" });
    console.log("🗑️ Deleted Book:", deletedBook);

    // 6. QUERY Example: find books after 2010
    const recentBooks = await Book.find({ year: { $gt: 2010 } });
    console.log("🔍 Books after 2010:", recentBooks);

    // 7. AGGREGATION Example: count books per author
    const booksPerAuthor = await Book.aggregate([
      { $group: { _id: "$author", totalBooks: { $sum: 1 } } }
    ]);
    console.log("📊 Books per Author:", booksPerAuthor);

  } catch (err) {
    console.error("❌ CRUD Error:", err.message);
  } finally {
    // 8. DISCONNECT
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

main();
