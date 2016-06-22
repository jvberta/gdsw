"use strict";

const uniqueValidator = require("mongoose-unique-validator");
const mongoose = require("mongoose");

let Application;
const ApplicationSchema = require("./schemas/application");

ApplicationSchema.methods.checkSecret = function checkSecret(secret) {
    return secret === this.clientSecret;
};

ApplicationSchema.plugin(uniqueValidator);

try {
    Application = mongoose.model("Application", ApplicationSchema);
} catch (e) {
    Application = mongoose.model("Application");
}
module.exports = Application;
