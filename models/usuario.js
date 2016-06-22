"use strict";

const uniqueValidator = require("mongoose-unique-validator");
const Promise = require("bluebird");
const mongoose = require("mongoose");
const validator = require("validator");

const queryPlugin = require("../query-plugin");
const UsuarioSchema = require("./validators/usuario");
const errors = require("../errors").customErrors;

const NotFound = errors.NotFound;
const ValidationError = errors.ValidationError;

UsuarioSchema.plugin(uniqueValidator);

UsuarioSchema.statics = {

    getByCpf(cpf) {
        return UsuarioModel.findOne({cpf})
            .then(usuario => {
                if (usuario) {
                    return Promise.resolve(usuario);
                }
                return Promise.reject(new NotFound("Usuario", {cpf}));
            });
    },

    getAllByQuery: queryPlugin("Usuario"),

    create(data) {
        let user = new UsuarioModel(data);

        return user.save();
    },

    updateUsuarioById(id, mod) {
        const options = {new: true, runValidators: true};

        mod.atualizadoEm = Date.now();

        return UsuarioModel.findByIdAndUpdate(id, mod, options)
            .then(usuario => {
                if (!usuario) {
                    throw new NotFound("Usuario", {_id: id});
                }
                return usuario;
            });
    }
};


const UsuarioModel = module.exports = mongoose.model("Usuario", UsuarioSchema);
