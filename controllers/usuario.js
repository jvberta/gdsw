"use strict";

const models = require("../models");
const UsuarioModel = models.usuario;

const CREATED_STATUS_CODE = 201;
const NO_CONTENT_STATUS_CODE = 204;

module.exports = {
    index(req, res, next) {
        const query = req.query_handler;

        UsuarioModel.getAllByQuery(query)
            .then(usuarios => res.json(usuarios))
            .catch(err => next(err));
    },

    create(req, res, next) {
        const data = req.body;

        UsuarioModel.create(data)
            .then(usuario => {
                res.setHeader("Location", req.baseUrl + req.path + usuario._id);
                res.status(CREATED_STATUS_CODE).send("Criado com sucesso");
            })
            .catch(err => next(err));
    },

    updateMe(req, res, next) {
        const data = req.body;

        UsuarioModel.updateUsuarioById(req.user._id, data)
            .then(usuario => res.json(usuario))
            .catch(err => next(err));
    },

    show(req, res, next) {
        const id = req.params.id;

        UsuarioModel.findById(id)
            .then(usuario => res.json(usuario))
            .catch(err => next(err));
    },

    showMe(req, res, next) {
        const cpf = req.user.cpf;

        UsuarioModel.getByCpf(cpf)
            .then(usuario => res.json(usuario))
            .catch(err => next(err));
    }
};
