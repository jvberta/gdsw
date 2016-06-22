"use strict";

const Promise = require("bluebird");
const bcrypt = require("bcrypt-nodejs");
const crypto = require("crypto");
const models = require("../models");
const errors = require("../errors").customErrors;

const usuarioModel = models.usuario;
const InvalidCredentials = errors.InvalidCredentials;

function verifyPassword(senha, user) {
    if (user && bcrypt.compareSync(senha, user.senha)) {
        return user;
    }
    return Promise.reject(new InvalidCredentials());
}

exports.local = function loginLocal(cpf, senha) {
    return usuarioModel.getByCpf(cpf)
        .then(user => verifyPassword(senha, user));
};
