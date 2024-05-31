const { APP_MESSAGES } = require("./En");
const { ValidationError } = require('mongoose').Error;
// const { format, parse } = require('date-fns');


exports.controllerResult = ({ req, res, result, message, statusCode, totalPages }) => {
  if (result instanceof Error) {
    const errorMessage = statusCode
      ? message || result.message
      : APP_MESSAGES.SERVER_ERROR;
    return res.status(statusCode || 500).json({
      status: false,
      message: "Error: " + errorMessage,
      error: result,
    });
  } else {
    return res.status(statusCode || 200).json({
      status: true,
      ...(message ? { message: message } : {}),
      data: result,
      totalPages
    });
  }
};

// Helper function to parse and format date
// exports.formatDate = (dateString, outputFormat = "dd/MM/yyyy") => {
//   const inputFormats = ['yyyy-MM-dd', 'dd/MM/yyyy', 'MM/dd/yyyy', 'yyyy/MM/dd', 'yyyy/MM/dd HH:mm:ss'];
  
//   for (const format of inputFormats) {
//     const parsedDate = parse(dateString, format, new Date());
//     if (!isNaN(parsedDate.getTime())) {
//       return format(parsedDate, outputFormat);
//     }
//   }
  
//   return dateString; // Return input string if unable to parse
// };


