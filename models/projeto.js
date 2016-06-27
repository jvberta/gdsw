/** @module projeto/model */

"use strict";

const mongoose = require("mongoose");
const Promise = require("bluebird");
const validator = require("validator");

const queryPlugin = require("../query-plugin");
const ProjetoSchema = require("./schemas/projeto.js");
const customErrors = require("../errors").customErrors;

const NotFound = customErrors.NotFound;
const ValidationError = customErrors.ValidationError;

/**
* Verifica se foram encontrados dados numa requisição
* @param {string} resource - Retorno de uma requisição
* @param {string} query - Consulta que foi realizada
* @return {Promise.resolve} Dados encontrados
* @return {Promise.reject} Dados não encontrados
*/
function existsOrRejectWithNotFound(resource, query) {
    if (!resource) {
        query = query || {};
        return Promise.reject(new NotFound("Projeto", query));
    }
    return Promise.resolve(resource);
}


ProjetoSchema.statics = {
    create(data) {
        const projeto = new ProjetoModel(data);

        return projeto.save();
    },

    getAllByQuery: queryPlugin("Projeto"),

    getById(id, projection = {}) {
        return this.findById(id, projection)
            .populate("autor candidatos")
            .then(projeto => existsOrRejectWithNotFound(projeto, {id}));

    },

    update(idProjeto, data) {
        const mod = data;
        const options = {
            new: true,
            runValidators: true,
        };

        mod.atualizadoEm = Date.now();

        return this.findByIdAndUpdate(idProjeto, mod, options)
            .then(projeto => existsOrRejectWithNotFound(projeto, {_id:idProjeto}));

    },

    adicionarCandidato(idProjeto, idUsuario) {
        const mod = {$addToSet: {candidatos: idUsuario}};
        const options = {new: true};

        mod.atualizadoEm = Date.now();

        return this.findByIdAndUpdate(idProjeto, mod, options)
            .then(projeto => existsOrRejectWithNotFound(projeto, {_id:idProjeto}));

    },

    removerCandidato(idProjeto, idUsuario) {
        const mod = {$pull: {candidatos: idUsuario}};
        const options = {new: true};

        mod.atualizadoEm = Date.now();

        return this.findByIdAndUpdate(idProjeto, mod, options)
            .then(projeto => existsOrRejectWithNotFound(projeto, {_id:idProjeto}));

    },

    escolherCandidato(idProjeto, escolhido = "", vaga = "") {
        const query = {_id: idProjeto, status: "emAberto", candidatos: escolhido};
        const mod = {$addToSet: {escolhidos: {escolhido, vaga}, vagasPreenchidas: vaga}}
        const options = {new: true};

        mod.atualizadoEm = Date.now();

        return Promise.try(() => {
            if (!escolhido || !validator.isMongoId(escolhido) || !vaga) {
                let erro = {};

                erro.escolhidos = {
                    path: "escolhidos",
                    value: escolhido,
                    message: "Obrigatorio informar o candidato escolhido e a vaga a ser preenchida"
                };

                throw new ValidationError("Projeto", erro);
            }
        })
        .then(() => this.findOneAndUpdate(query, mod, options))
        .then(projeto => existsOrRejectWithNotFound(projeto, query))
        .then(projeto => projeto.vagas.length === projeto.vagasPreenchidas.length ?
                this.findByIdAndUpdate(idProjeto, {status: "finalizado"}, options): projeto);
    },

    enviarMsg(idProjeto, from, to, message) {
        const query = {_id: idProjeto};
        const mod = {$addToSet:{entrevista: {from, to, message}}};
        const options = {new: true};

        return this.findByIdAndUpdate(idProjeto, mod, options)
            .then(projeto => existsOrRejectWithNotFound(projeto, query));
    }
};

const ProjetoModel = module.exports = mongoose.model("Projeto", ProjetoSchema);
