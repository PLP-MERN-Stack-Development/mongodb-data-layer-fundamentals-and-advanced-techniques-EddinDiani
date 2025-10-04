const { mongoose } = require('../db');
const { Schema } = mongoose;

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    status: { 
      type: String, 
      enum: ["todo", "in_progress", "done"], 
      default: "todo" 
    },
    owner: { type: String, required: true }
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = { Task };
