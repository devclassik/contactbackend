const mongoose = require('mongoose');

// Define the schema for the question answer options
const answerOptionSchema = new mongoose.Schema({
  answerText: {
    type: String,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  }
});

// Define the schema for the question
const quizSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
    unique: [true, "Question already exist"],
},
  answerOptions: {
    type: [answerOptionSchema],
    required: true
  }
});

// Create a mongoose model for the question schema
const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
