"use strict";

const uniqueValidator = require("mongoose-unique-validator");
const mongoose = require("mongoose");

let RefreshToken;
const RefreshTokenSchema = require("./schemas/refreshToken");

RefreshTokenSchema.statics.createToken = function createToken(userId, applicationId, accessTokenId) {
    var token = new RefreshToken({userId, applicationId, accessTokenId});

    return token.save();
};

RefreshTokenSchema.statics.findByToken = function findByToken(token) {
    return this.findOne({token})
        .populate({path: "userId accessTokenId"});
};

RefreshTokenSchema.plugin(uniqueValidator);

try {
    RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);
} catch (e) {
    RefreshToken = mongoose.model("RefreshToken");
}

module.exports = RefreshToken;
