const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const helper = require("../../utilities/helpers");
const Blog = require("../../models/Blog");
// const { uploadFile } = require("../../../utility/fileUpload");

exports.addBlog = async (req, res) => {
  try {
    let dataToSend = await Blog.create(req.body);
    return helper.controllerResult({
      req,
      res,
      result: dataToSend,
      message: "New blog added",
    });
  } catch (error) {
    return helper.controllerResult({
      req,
      res,
      statusCode: 400,
      result: "Title already exist " + error,
      message: error.message,
    });
  }
};

exports.getAllBlog = async (req, res) => {
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  try {
    const skipDocuments = (page - 1) * limit;
    const totalDocuments = await Blog.countDocuments();
    const totalPages = Math.ceil(totalDocuments / limit);
    const pipeline = [
      { $sort: { updatedAt: -1 } },
      { $skip: skipDocuments },
      { $limit: limit },
    ];
    let dataToSend = await Blog.aggregate(pipeline);
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

exports.getBlogByID = async (req, res) => {
  try {
    const blogId = req.params.id;
    // Check if the document exists
    const dataToSend = await Blog.findById(blogId);
    if (!dataToSend) {
      // If no matching document found, return an error message
      const msg = "Oops!, No document found, kindly check the URL";
      return helper.controllerResult({
        req,
        res,
        result: msg,
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

exports.searchBlog = async (req, res) => {
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
    const dataToSend = await Blog.find({
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { content: searchRegex },
      ],
    }).limit(100);

    if (dataToSend.length === 0) {
      const msg = "Oops, No document found for the provided search keyword";
      return helper.controllerResult({
        req,
        res,
        result: msg,
        totalPages: 0,
      });
    }

    return helper.controllerResult({
      req,
      res,
      result: dataToSend,
      totalPages: dataToSend.length,
      message: "Blog post(s) found",
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


exports.updateBlog = async (req, res) => {
  const { img, title, description } = req.body;
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      const msg = "Oops!, No document found, kindly check the URL";
      return helper.controllerResult({
        req,
        res,
        result: msg,
      });
    }

    blog.img = img;
    blog.title = title;
    blog.description = description;

    const dataToSend = await blog.save();
    return helper.controllerResult({
      req,
      res,
      result: dataToSend,
      message: "Blog Updated",
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

exports.deleteBlog = async (req, res) => {
  // console.log("id delete", req.params.id);
  try {
    const dataToSend = await Blog.findByIdAndDelete(req.params.id);
    if (!dataToSend) {
      const msg = "Oops!, No document found, kindly check the URL";
      return helper.controllerResult({
        req,
        res,
        result: msg,
        totalPages: 0,
      });
    }
    // console.log("deleted", dataToSend);
    return helper.controllerResult({
      req,
      res,
      result: dataToSend,
      message: "Blog Deleted",
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

// exports.uploadFile = async (req, res) => {
//   try {
//     const { mimeType } = req.query;
//     // const containerName = 'quickstart' + uuidv1();
//     const url = await uploadFile(req, "workoder-safetyfiles");
//     if (url) {
//       const data = {
//         mimeType: req.body.fileMimeType,
//         url: url.Location,
//         name: req.body.type,
//       };
//       let dataToSend = await WorkOrder.findByIdAndUpdate(
//         req.params.id,
//         { $push: { safetyPermitDocument: data } },
//         { new: true }
//       );
//       return helper.controllerResult({
//         req,
//         res,
//         result: dataToSend,
//         message: message.SUCCESS,
//       });
//     }
//   } catch (error) {
//     return helper.controllerResult({
//       req,
//       res,
//       result: error,
//       message: error.message,
//     });
//   }
// };
