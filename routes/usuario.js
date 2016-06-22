 "use strict";

const bodyParser = require("body-parser");
const express = require("express");
const router = new express.Router();
const errors = require("../errors");

const errorsMiddleware = errors.middleware;
const Unauthorized = errors.customErrors.Unauthorized;

const UsuarioCtrl = require("../controllers").usuario;

router.use(bodyParser.json());

router.route("/")
	.get(UsuarioCtrl.index)
    .post(UsuarioCtrl.create);

router.route("/me")
	.get(UsuarioCtrl.showMe)
	.put(UsuarioCtrl.updateMe);

router.route("/:id")
	.get(UsuarioCtrl.show);

router.use(errorsMiddleware());

module.exports = router;
