require('dotenv').config();
const { connectDB, mongoose } = require('./db');
const { User } = require('./models/User');
const { Task } = require('./models/Task');

async function main() {
  try {
    await connectDB();

    console.log("Connected. Clearing collections...");

    await User.deleteMany({});
    await Task.deleteMany({});

    await User.insertMany([
      { name: "Alice Kaioki", email: "alic@gmail.com" },
      { name: "Alloy Kimani", email: "alloy@gmail.com" }
    ]);

    await Task.insertMany([
      { title: "Write Proposal", status: "todo", owner: "Alice" },
      { title: "Design Schema", status: "in_progress", owner: "Alloy" }
    ]);

    console.log("Data populated successfully!");
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

main();
