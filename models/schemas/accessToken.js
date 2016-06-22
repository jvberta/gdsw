"use strict";

const uid = require("uid");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AccessTokenSchema = new Schema({
    token: {
        type: String,

        unique: true,

        default: () => uid(48)
    },

    userId: {
        type: Schema.Types.ObjectId,

        ref: "Usuario",

        required: true
    },

    applicationId: {
        type: Schema.Types.ObjectId,

        ref: "Application"
    },

    active: {
        type: Boolean,

        default: true
    },

    expirationDate: {
        type: Date,

        expires: "30m"

    },

    scope: {
        type: [String],

        required: true
    }
});

module.exports = AccessTokenSchema;
