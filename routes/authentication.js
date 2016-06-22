"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const errorsMiddleware = require("../errors").middleware;

const oauth = require("../oauth").oauth();

let Routes;

Routes = function () {
    const router = express.Router();

    router.use(bodyParser.json());

    router.post("/token", oauth.token);

    router.use(errorsMiddleware());

    return router;
};

module.exports = Routes;
