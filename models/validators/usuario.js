"use strict";

const validator = require("validator");

const UsuarioSchema = require("../schemas/usuario");
const ContaSchema = require("../schemas/usuario");

UsuarioSchema.path("email")
    .validate(
        email => validator.isEmail(email), "{VALUE} não é um email valido");

UsuarioSchema.path("nome")
    .validate(
        nome => validator.isAlpha(validator.blacklist(nome, " "), "pt-PT"), "{PATH} {VALUE} deve conter apensas letras");

UsuarioSchema.path("cpf")
    .validate(cpf => validator.isNumeric(cpf), "{PATH} {VALUE} deve conter apenas numeros");

UsuarioSchema.path("cpf")
    .validate(
        cpf => {
            const digitoCpf = cpf.slice(9, 11).split("");

            let n1 = 10;
            const soma1 = cpf.slice(0, 9)
                                .split("")
                                .map(digito => digito * n1--).reduce((soma, x) => soma + x);
            const resto1 = soma1 * 10 % 11;

            let n2 = 11;
            const soma2 = cpf.slice(0, 10)
                            .split("")
                            .map(digito => digito * n2--).reduce((soma, x) => soma + x);
            const resto2 = soma2 * 10 % 11;

            const dig1 = parseInt(digitoCpf[0]);
            const validDig1 = ((dig1 === resto1) || (dig1 === 0 && resto1 === 10));

            const dig2 = parseInt(digitoCpf[1]);
            const validDig2 = (dig2 === resto2) || (dig2 === 0 && resto2 === 10);

            return (validDig1 && validDig2);
        }, "{PATH} {VALUE} invalido");

UsuarioSchema.path("siape")
    .validate(siape => validator.isNumeric(siape), "{PATH} {VALUE} deve conter apenas numeros");

UsuarioSchema.path("campus")
    .validate(inst => validator.isAlpha(validator.blacklist(inst, " ")), "{PATH} {VALUE} deve conter apenas letras");

UsuarioSchema.path("curso")
    .validate(curso => validator.isAlpha(validator.blacklist(curso," "),"pt-PT"),
      "{PATH} {VALUE} deve conter apenas letras");

module.exports = UsuarioSchema;
