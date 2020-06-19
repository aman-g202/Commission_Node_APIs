var datetime = require("node-datetime");
const path = require("path");
const fs = require("fs");
const { validationResult } = require("express-validator");

exports.getDateTime = dateTime => {
    var dt = datetime.create(dateTime);
    return dt.format("Y-m-d H:M:S");
};

exports.getNextDayDateTime = dateTime => {
    var dt = datetime.create(dateTime);
    dt.offsetInDays(1);
    return dt.format("Y-m-d H:M:S");
};

exports.getDateOnly = dateTime => {
    var dt = datetime.create(dateTime);
    return dt.format("Y-m-d");
};

exports.getNextDayDateOnly = dateTime => {
    var dt = datetime.create(dateTime);
    dt.offsetInDays(1);
    return dt.format("Y-m-d");
};

exports.checkInputError = req => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed, entered data is incorrect");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
};

exports.checkInputErrorWithImage = (req, imagePath) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        if (imagePath) {
            this.clearImage(imagePath);
        }
        const error = new Error("Validation failed, entered data is incorrect");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
};

exports.clearImage = filePath => {
    filePath = path.join(__dirname, "../", filePath);
    fs.unlink(filePath, err => {
        console.log(err);
    });
};

exports.clearExcel = filePath => {
    filePath = path.join(__dirname, "../", filePath);
    fs.unlink(filePath, err => {
        console.log(err);
    });
};

exports.sendResponse = (res, statusCode, data = [], totalCounts = null) => {
    res.status(statusCode).json({
        status: 'success',
        statusCode: statusCode,
        totalCounts: totalCounts,
        data: data
    });
};

exports.sendError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    throw error;
};