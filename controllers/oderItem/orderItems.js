const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const helper = require("../../utilities/helpers");
const OrderItem = require("../../models/OrderItem");
const erroMsg = "Oops!, No OrderItems found, kindly check the URL";

exports.addOrderItem = async (req, res) => {
  try {
    let dataToSend = await OrderItem.create(req.body);
    return helper.controllerResult({
      req,
      res,
      result: dataToSend,
      message: "New product added",
    });
  } catch (error) {
    return helper.controllerResult({
      req,
      res,
      statusCode: 400,
      result: { msg: "OrderItem already exist ", error },
      message: error.message,
    });
  }
};

// Controller function to create multiple questions in bulk
exports.createBulkOrderItem = async (req, res) => {
  try {
    let dataToSend = await OrderItem.create(req.body);
    return helper.controllerResult({
      req,
      res,
      result: dataToSend,
      message: "New product(s) added",
    });
  } catch (error) {
    return helper.controllerResult({
      req,
      res,
      statusCode: 400,
      result: "Product already exist " + error,
      message: error.message,
    });
  }
};

exports.getAllOrderItem = async (req, res) => {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    try {
      const skipDocuments = (page - 1) * limit;
      const totalDocuments = await OrderItem.countDocuments();
      const totalPages = Math.ceil(totalDocuments / limit);
      const pipeline = [
        { $sample: { size: limit } },
      ];
      let dataToSend = await OrderItem.aggregate(pipeline);
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

  exports.getOrderItemByID = async (req, res) => {
    try {
      const QuizId = req.params.id;
      // Check if the document exists
      const dataToSend = await OrderItem.findById(QuizId);
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

  exports.searchOrderItem = async (req, res) => {
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
      const dataToSend = await OrderItem.find({
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
        message: "OrderItem post(s) found",
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
  exports.updateOrderItem = async (req, res) => {
    try {
      const dataToSend = await OrderItem.findByIdAndUpdate(req.params.id, req.body, {
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
        message: "Product updated successfully",
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
  exports.deleteOrderItem = async (req, res) => {
    try {
      const dataToSend = await OrderItem.findByIdAndDelete(req.params.id);
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
        message: "Product Deleted",
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
  exports.deleteBulkOrderItem = async (req, res) => {
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
      const dataToSend = await OrderItem.deleteMany({ _id: { $in: ids } });
  
      return helper.controllerResult({
        req,
        res,
        result: dataToSend,
        message: "OrderItem deleted successfully",
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
