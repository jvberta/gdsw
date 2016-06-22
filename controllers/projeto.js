"use strict";


const Promise = require("bluebird");

const Projeto = require("../models").projeto;

module.exports = {
    index(req, res, next) {
        Projeto.getAllByQuery(req.query_handler)
            .then(projetos => res.json(projetos))
            .catch(err => next(err));
    },

    create(req, res, next) {
        const {body} = req;

        body.autor = req.user._id;
        body.campus = req.user.campus;

        Projeto.create(body)
			.then(projetoCb => res.json(projetoCb))
			.catch(err => next(err));
    },

    show(req, res, next) {
        const idProjeto = req.params.idProjeto;

        Projeto.getById(idProjeto)
                .then(projeto => res.json(projeto))
                .catch(err => next(err));
    },

    showProjetosByUsuario(req, res, next) {
        const usuario = req.user;
        const query = req.query_handler || {};

        query.fields = query.fields || {};
        query.fields.autor = usuario._id;

        Projeto.getAllByQuery(query)
            .then(projetos => res.json(projetos))
            .catch(err => next(err));
    },

    update(req, res, next) {
        const idProjeto = req.params.idProjeto;
        const data = req.body;

        Projeto.update(idProjeto, data)
			.then(projeto => res.json(projeto))
			.catch(err => next(err));
    },

    candidatarSeAoProjeto(req, res, next) {
        const user = req.user._id;
        const {idProjeto} = req.params;

        Projeto.adicionarCandidato(idProjeto, user)
			.then(projeto => res.json(projeto))
			.catch(err => next(err));
    },

    descandidatarSeDoProjeto(req, res, next) {
        const user = req.user._id;
        const {idProjeto} = req.params;

        Projeto.removerCandidato(idProjeto, user)
			.then(projeto => res.json(projeto))
			.catch(err => next(err));

    },

    escolherCandidato(req, res, next) {
        const {candidato, vaga} = req.body;
        const {idProjeto} = req.params;

        Projeto.escolherCandidato(idProjeto, candidato, vaga)
			.then(projeto => res.json(projeto))
			.catch(err => next(err));

    }

};
