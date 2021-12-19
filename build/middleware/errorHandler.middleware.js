"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errorHandler = function (err, req, res, next) {
    var status = err.status || 500;
    var message = err.message || 'Something went wrong';
    res.status(status).json({ status: status, message: message });
};
exports.default = errorHandler;
