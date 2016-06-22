"use strict";

const mongoose = require("mongoose");

let AccessToken;
const AccessTokenSchema = require("./schemas/accessToken");

AccessTokenSchema.statics = {
    createToken(userId, applicationId, scope) {
        const data = {userId, applicationId, scope};
        const token = new AccessToken(data);

        return token.save();
    },

    getByTokenPopulated(token) {
        return AccessToken.findOne({token})
            .populate({path: "userId"});
    }

};

try {
    AccessToken = mongoose.model("AccessToken", AccessTokenSchema);
} catch (e) {
    AccessToken = mongoose.model("AccessToken");
}

module.exports = AccessToken;
