"use strict";

const mongoose = require("mongoose");
const Promise = require("bluebird");

const errors = require("../errors").customErrors;

const NotFound = errors.NotFound;

/**
 * metodo para pesquisar no banco de dados
 * @param  {String} model modelo que sera consultado
 * @return {Function(query)}
 * função de query que pode ser utilizada em qualquer modelo
 * é passado o nome do modelo para o método e é retornado
 * uma função que espera a query a ser feita e retorna uma promise com a consulta no banco
 * a query aceita os seguintes atributos
 * fields - lista os registros atraves dos campos especificados
 * or - lista os registros com condicional OU no formato [{campo1:valor1,campo2:valor2...}]
 * and - lista os registros com condicional E no formato [{campo1:valor1,campo2:valor2...}]
 * sort - ordena os registros no formato "campo,..." para ordem crescente e "-campo,..." para ordem decrescente
 * skip - pula n registros
 * limit - limita a quantidade de registros a serem retornados
 * select - seleciona os campos do modelo a serem retornados
 */
module.exports = function (model) {
    return function (query) {
        query = query ? query : {};
        let fields = query.fields ? query.fields : {},
            promise = mongoose.model(model).find(fields);

        if (query.or) {
            promise = promise.or(query.or);
        }
        if (query.and) {
            promise = promise.and(query.and);
        }
        if (query.sort) {
            promise = promise.sort(query.sort);
        }
        if (query.skip) {
            promise = promise.skip(query.skip);
        }
        if (query.limit) {
            promise = promise.limit(query.limit);
        }
        if (query.select) {
            promise = promise.select(query.select);
        }
        if (process.env.NODE_ENV === "test") {
            promise = promise.lean();
        }

        console.log(query);

        return promise.populate("autor candidatos").then(
            results => {
                return results.length ? Promise.resolve(results) : Promise.reject(new NotFound(model, query));
            });
    };
};
