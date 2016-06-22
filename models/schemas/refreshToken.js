"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uid = require("uid");

const RefreshTokenSchema = new Schema({

    token: {
        type: String,

        unique: true,

        default: () => uid(64)
    },

    userId: {
        type: Schema.Types.ObjectId,

         ref: "Usuario"
    },

    applicationId: {
        type: Schema.Types.ObjectId,

        ref: "Application"
    },

    accessTokenId: {
        type: Schema.Types.ObjectId,

        ref: "AccessToken"
    },

    active: {
        type: Boolean,

        default: true
    },

    expirationDate: {
        type: Date,

        expires: "7d"
    }
});

module.exports = RefreshTokenSchema;
