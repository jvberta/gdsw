/** @module projeto/schema */
"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const valiator = require("validator");

const MensagemSchema = new Schema({
    from: {type: Schema.Types.ObjectId, ref: "Usuario", required: true},
    to: {type: Schema.Types.ObjectId, ref: "Usuario", required: true},
    message: String,
    dataEnvio: {type: Date, set: Date.now, default: Date.now}
});

const EscolhidoSchema = new Schema({
    escolhido: {type: Schema.Types.ObjectId, ref: "Usuario", required: true},
    vaga: String
});

const ProjetoSchema = new Schema({
    titulo: String,
    autor: {type: Schema.Types.ObjectId, ref: "Usuario", required: true},
    descricao: String,
    status: {type: String, required: true, default: "emAberto"},
    campus: String,
    areaDoConhecimento: String,
    vagas: [String],
    vagasPreenchidas: [String],
    candidatos: [{type: Schema.Types.ObjectId, ref: "Usuario"}],
    entrevista: [MensagemSchema],
    escolhidos: [EscolhidoSchema],
    criadoEm: {type: Date, default: Date.now},
    atualizadoEm: {type: Date, default: Date.now, set: Date.now}
});

module.exports = ProjetoSchema;
