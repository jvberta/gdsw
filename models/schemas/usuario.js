"use strict";

const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");

const escolaridades = [
    "nivel medio incompleto",
    "nivel medio",
    "superior incompleto",
    "superior",
    "pos graduacao",
    "mestrado",
    "doutorado",
    "pos doutorado",
];


function generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

const UsuarioSchema = new mongoose.Schema({
    cpf: {
        type: String,

        required: true,

        unique: true,

        minlength: [11,"O {PATH} {VALUE} contem menos que 11 digitos"],

        maxlength: [11,"O telefone {VALUE} contem mais que 11 digitos"]

    },
    nome: {type: String, index: true},
    senha: {type: String, set: generateHash, required: true},
    email: {type: String, unique: true, sparse: true, required: false},
    tipo: {
        type: String,
        enum: {
            values: ["servidor", "aluno"],
            message: "{VALUE} não é um das opções servidor, aluno",
        }
    },
    cargo: String,
    escolaridade: {
        type: String,

        enum: {
            values: escolaridades,
            message: `{VALUE} não é uma das opções ${escolaridades.join()}`,
        }
    },
    dataDeNascimento: Date,
    siape: {type: String, unique: true, sparse: true, required: false},
    campus: {type:String, required: true},
    setor: String,
    curso: String,
    periodo: Number,
    criadoEm: {type: Date, default: Date.now},
    atualizadoEm: {type: Date, default: Date.now, set: Date.now, index: true}
});

module.exports = UsuarioSchema;
