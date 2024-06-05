const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const helper = require("../../utilities/helpers");
const Quiz = require("../../models/Quiz");
const erroMsg = "Oops!, No quiz found, kindly check the URL";
// const { uploadFile } = require("../../../utility/fileUpload");

exports.addQuiz = async (req, res) => {
  try {
    let dataToSend = await Quiz.create(req.body);
    return helper.controllerResult({
      req,
      res,
      result: dataToSend,
      message: "New quiz added",
    });
  } catch (error) {
    return helper.controllerResult({
      req,
      res,
      statusCode: 400,
      result: "Question already exist " + error,
      message: error.message,
    });
  }
};

// Controller function to create multiple questions in bulk
exports.createBulkQuiz = async (req, res) => {
  try {
    let dataToSend = await Quiz.create(req.body);
    return helper.controllerResult({
      req,
      res,
      result: dataToSend,
      message: "New quiz added",
    });
  } catch (error) {
    return helper.controllerResult({
      req,
      res,
      statusCode: 400,
      result: "Question already exist " + error,
      message: error.message,
    });
  }
};

exports.getAllQuiz = async (req, res) => {
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  try {
    const skipDocuments = (page - 1) * limit;
    const totalDocuments = await Quiz.countDocuments();
    const totalPages = Math.ceil(totalDocuments / limit);
    const pipeline = [
      { $sort: { updatedAt: -1 } },
      { $skip: skipDocuments },
      { $limit: limit },
    ];
    let dataToSend = await Quiz.aggregate(pipeline);
    return helper.controllerResult({
      req,
      res,
      result: dataToSend,
      totalPages,
      message: "Success",
    });
  } catch (error) {
    return helper.controllerResult({
      req,
      res,
      result: error,
      message: error.message,
    });
  }
};

exports.getQuizByID = async (req, res) => {
  try {
    const QuizId = req.params.id;
    // Check if the document exists
    const dataToSend = await Quiz.findById(QuizId);
    // console.log('res', dataToSend);
    if (!dataToSend) {
      // If no matching document found, return an error message
      return helper.controllerResult({
        req,
        res,
        result: erroMsg,
        totalPages: 0,
      });
    }
    // Calculate the total pages
    return helper.controllerResult({
      req,
      res,
      result: dataToSend,
      message: "Success",
    });
  } catch (error) {
    return helper.controllerResult({
      req,
      res,
      result: error,
      message: error.message,
    });
  }
};

exports.searchQuiz = async (req, res) => {
  try {
    const { search } = req.query;

    if (!search) {
      const msg = "Oops!, Search query is required";
      return helper.controllerResult({
        req,
        res,
        result: msg,
        totalPages: 0,
      });
    }
    const searchRegex = new RegExp(search, "i"); // Case-insensitive search
    const dataToSend = await Quiz.find({
      $or: [
        { questionText: searchRegex },
        { answerOptions: searchRegex },
      ],
    }).limit(100);

    if (dataToSend.length === 0) {
      return helper.controllerResult({
        req,
        res,
        result: erroMsg,
        totalPages: 0,
      });
    }

    return helper.controllerResult({
      req,
      res,
      result: dataToSend,
      totalPages: dataToSend.length,
      message: "Quiz post(s) found",
    });
  } catch (error) {
    return helper.controllerResult({
      req,
      res,
      result: error,
      message: error.message,
    });
  }
};


// Controller function to update a question by ID
exports.updateQuiz = async (req, res) => {
  try {
    const dataToSend = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!dataToSend) {
      return helper.controllerResult({
        req,
        res,
        result: erroMsg,
        statusCode: 404,
      });
    }
    return helper.controllerResult({
      req,
      res,
      result: dataToSend,
      message: "Quiz updated successfully",
    });
  } catch (error) {
    return helper.controllerResult({
      req,
      res,
      result: error,
      message: error.message,
    });
  }
};

// Controller function to delete a single question by ID
exports.deleteQuiz = async (req, res) => {
  try {
    const dataToSend = await Quiz.findByIdAndDelete(req.params.id);
    if (!dataToSend) {
      return helper.controllerResult({
        req,
        res,
        result: erroMsg,
        totalPages: 0,
      });
    }
    return helper.controllerResult({
      req,
      res,
      result: dataToSend,
      message: "Quiz Deleted",
    });
  } catch (error) {
    // console.log("error", error);
    return helper.controllerResult({
      req,
      res,
      result: error,
      message: error.message,
    });
  }
};

// Controller function to delete multiple questions by IDs
exports.deleteBulkQuiz = async (req, res) => {
  // console.log('helo working');
  try {
    const { ids } = req.body;
    // console.log('ids', ids);
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      const msg = "Oops!, Invalid IDs provided";
      return helper.controllerResult({
        req,
        res,
        result: msg,
        totalPages: 0,
      });
    }
    const dataToSend = await Quiz.deleteMany({ _id: { $in: ids } });

    return helper.controllerResult({
      req,
      res,
      result: dataToSend,
      message: "Questions deleted successfully",
    });
  } catch (error) {
    return helper.controllerResult({
      req,
      res,
      result: error,
      message: error.message,
    });
  }
};
