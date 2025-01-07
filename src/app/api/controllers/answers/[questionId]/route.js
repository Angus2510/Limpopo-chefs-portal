// Importing the necessary models
const Answer = require("../models/Answer");
const Question = require("../models/Question");

// @desc Get all answers for a specific question
// @route GET /questions/:questionId/answers
// @access Public
const getAnswersForQuestion = async (req, res) => {
  try {
    const { questionId } = req.params; // Extracting question ID from the request params

    // Fetching the question by its ID and populating its answers
    const question = await Question.findById(questionId).populate("answers");

    // If question not found, send 404 response
    if (!question) {
      return res.status(404).json({ msg: "Question not found" });
    }

    // Respond with the answers associated with the question
    res.json(question.answers);
  } catch (err) {
    // Handle any unexpected errors
    res.status(500).send(err);
  }
};

// @desc Submit an answer to a specific question
// @route POST /questions/:questionId/answers
// @access Public
const submitAnswerToQuestion = async (req, res) => {
  try {
    const { questionId } = req.params; // Extracting question ID from request params

    // Fetching the question by its ID
    const question = await Question.findById(questionId);

    // If question not found, send 404 response
    if (!question) {
      return res.status(404).json({ msg: "Question not found" });
    }

    // Creating a new answer based on the request body
    const newAnswer = new Answer({
      ...req.body, // Spread the answer data from the body
      question: questionId, // Linking the answer to the question
    });

    // Saving the new answer to the database
    await newAnswer.save();

    // Adding the new answer to the question's answers array
    question.answers.push(newAnswer);
    await question.save(); // Saving the updated question

    // Responding with the newly created answer
    res.status(201).json(newAnswer);
  } catch (err) {
    // Handling any errors while saving the answer
    res.status(400).send(err);
  }
};

// Exporting the controller functions
module.exports = {
  getAnswersForQuestion,
  submitAnswerToQuestion,
};
