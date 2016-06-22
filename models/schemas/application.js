"use strict";

const uid = require("uid");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ApplicationSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    clientId: {
        type: String,
        unique: true,
        default: function () {
            return uid(10);
        }
    },
    clientSecret: {
        type: String,
        default: function () {
            return uid(30);
        }
    },
    domains: {
        type: [{
            type: String
        }]
    }
});

module.exports = ApplicationSchema;
