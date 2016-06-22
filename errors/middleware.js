"use strict";

const validator = require("validator");

const UNPROCESSABLE_STATUS_CODE = 422;
const SERVER_ERROR_STATUS_CODE = 500;
const NOT_FOUND_STATUS_CODE = 404;
const UNAUTHORIZED_STATUS_CODE = 401;
const FORBIDDEN_STATUS_CODE = 403;
const BAD_REQUEST_STATUS_CODE = 400;

module.exports = function (opts) {
    let errorsNames = [];

    if (opts) {
        if ((typeof opts !== "object")) {
            throw new Error("opts deve ser um objeto");
        }

        errorsNames = Object.keys(opts);

        let invalidObjects = errorsNames.filter(key => !Number.isInteger(opts[key]));

        if (invalidObjects.length) {
            throw new Error("valores no objeto {Erro:valor...} devem ser do tipo inteiro ");
        }
    }

    return function (err, req, res, next) {
        if (res.headersSent) {
            return next(err);
        }
        switch (err.name) {
        case "ValidationError":
            res.status(UNPROCESSABLE_STATUS_CODE).json(err);
            break;
        case "NotFound":
            res.status(NOT_FOUND_STATUS_CODE).json(err);
            break;
        case "FormatError":
            res.status(BAD_REQUEST_STATUS_CODE).json(err);
            break;
        case "Unauthorized":
            res.status(FORBIDDEN_STATUS_CODE).json(err);
            break;
        case "InvalidToken":
            res.status(UNAUTHORIZED_STATUS_CODE).json(err);
            break;
        case "InvalidApplication":
            res.status(UNAUTHORIZED_STATUS_CODE).json(err);
            break;
        case "InvalidCredentials":
            res.status(UNAUTHORIZED_STATUS_CODE).json(err);
            break;
        default:
            if (validator.isIn(err.name, errorsNames)) {
                return res.status(opts[err.name]).json(err);
            }
            console.error(err.stack);
            return res.status(SERVER_ERROR_STATUS_CODE).send(err.stack);
        }
    };
};
