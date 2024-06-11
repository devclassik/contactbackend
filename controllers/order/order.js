const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const helper = require("../../utilities/helpers");
const Order = require("../../models/Order");
const erroMsg = "Oops!, No order found, kindly check the URL";

exports.addOrder = async (req, res) => {
  try {
    let dataToSend = await Order.create(req.body);
    return helper.controllerResult({
      req,
      res,
      result: dataToSend,
      message: "New Order added",
    });
  } catch (error) {
    return helper.controllerResult({
      req,
      res,
      statusCode: 400,
      result: { msg: "Order already exist ", error },
      message: error.message,
    });
  }
};

// Controller function to create multiple questions in bulk
exports.createBulkOrder = async (req, res) => {
  try {
    let dataToSend = await Order.create(req.body);
    return helper.controllerResult({
      req,
      res,
      result: dataToSend,
      message: "New order(s) added",
    });
  } catch (error) {
    return helper.controllerResult({
      req,
      res,
      statusCode: 400,
      result: "Order already exist " + error,
      message: error.message,
    });
  }
};

exports.getAllOrder = async (req, res) => {
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  try {
    const skipDocuments = (page - 1) * limit;
    const totalDocuments = await Order.countDocuments();
    const totalPages = Math.ceil(totalDocuments / limit);
    const pipeline = [{ $sample: { size: limit } }];
    let dataToSend = await Product.aggregate(pipeline);
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

exports.getOrderByID = async (req, res) => {
  try {
    const QuizId = req.params.id;
    // Check if the document exists
    const dataToSend = await Order.findById(QuizId);
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

exports.searchOrder = async (req, res) => {
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
    const dataToSend = await Order.find({
      $or: [{ questionText: searchRegex }, { answerOptions: searchRegex }],
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
      message: "Order post(s) found",
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
exports.updateOrder = async (req, res) => {
  try {
    const dataToSend = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
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
      message: "Order updated successfully",
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
exports.deleteOrder = async (req, res) => {
  try {
    const dataToSend = await Order.findByIdAndDelete(req.params.id);
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
      message: "Order Deleted",
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
exports.deleteBulkOrder = async (req, res) => {
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
    const dataToSend = await Product.deleteMany({ _id: { $in: ids } });

    return helper.controllerResult({
      req,
      res,
      result: dataToSend,
      message: "Products deleted successfully",
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
