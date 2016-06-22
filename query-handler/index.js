"use strict";

const errors = require("../errors").customErrors;

const FormatError = errors.FormatError;

module.exports = function handleQueryModule() {
    return function handleQuery(req, res, next) {
        const FIELD_NAMES = {
            or: "or",
            and: "and",
            limit: "limit",
            sort: "sort",
            skip: "skip",
            select: "select"
        };

        const ERROR_NAMES = {
            or: "query invalida",
            and: "query invalida",
            limit: "nao e um numero",
            skip: "nao e um numero",
            sort: "query invalida",
            duplicateKey: "chave duplicada"
        };

        const ERROR_MSGS = {
            or: "query deve ser como em or=field1=value1,field2=value2",
            and: "query deve ser como em and=field1=value1,field2=value2",
            limit: "voce deve fornecer um numero para o parametro limit",
            skip: "voce deve fornecer um numero para o parametro skip",
            sort: "o parametro sort deve ser como em sort=field,... for" +
                  "the ascending order or sort=-field,... for the descending order",
            duplicateKey: "voce nao pode duplicar uma chave"
        };

        let q = {};

        q.fields = {};
        const erros = {};
        q.queryHandled = true;

        let query = req.query;

        /**
         * Retornao uma expressao regular se o valor for do tipo string
         * @param  {any} value valor a ser transfomado em regexp ou nao
         * @return {any}       regexp caso string
         */
        function returnRegExpForStrings(value) {
            if (typeof value === "string") {
                return {$regex: `${value}`, $options: "i"};
            }

            return value;
        }

        /**
         * transforma o array no formato ["chave1=valor","chave2=valor2"..]
         *     em um array no formato [{chave1:valor1,chave2:valor2}]
         * @param  {Array} array valores nao formatados
         * @return {Array} valores formatados
         */
        function fieldToArray(array) {
            return array.map(field => {
                const d = field.split("=");
                const fieldName = d[0];
                const data = d[1];
                let retorno = {};

                retorno[fieldName] = returnRegExpForStrings(data);

                return retorno;
            });
        }

        /**
         * Monta o objeto de erro
         * @param  {string} fieldName nome do campo
         * @param  {[string,integer]} value valor do campo
         * @param  {string} error     nome do error
         * @param  {string} msg       mensagem do erro
         * @return {object}           erro
         */
        function errosFormatter(fieldName, value, error, message) {
            return {path: fieldName, value, error, message};
        }

        /**
         * valida a propriedade and da query
         * @param  {array} values valor no formato ["chave1=valor1","chave2=valor2"]
         * @return {boolean} query é valida
         */
        function validateOrAnd(values) {
            let valid = true;

            for (let val of values) {
                if (!(val.split("=").length === 2)) {
                    valid = false;
                    break;
                }
            }

            return valid;
        }

        /**
         * valida se a propriedade skip ou limit sao numeros
         * @param  {number} value valor de skip ou limit
         * @return {boolen}       é valido
         */
        function validateSkipLimit(value) {
            if (Number.isNaN(value)) {
                return false;
            }
            return true;
        }

        for (let key in query) {
            if (Array.isArray(query[key])) {
                erros[key] = errosFormatter(
                    key, query[key], ERROR_NAMES.duplicateKey, ERROR_MSGS.duplicateKey);
            } else {
                switch (key) {
                case FIELD_NAMES.or:
                    let orData = query[key].split(",");

                    if (validateOrAnd(orData)) {
                        q.or = fieldToArray(orData);
                    } else {
                        erros[key] = errosFormatter(key, query[key], ERROR_NAMES.or, ERROR_MSGS.or);
                    }
                    break;
                case FIELD_NAMES.and:
                    let andData = query[key].split(",");

                    if (validateOrAnd(andData)) {
                        q.and = fieldToArray(andData);
                    } else {
                        erros[key] = errosFormatter(key, query[key], ERROR_NAMES.and, ERROR_MSGS.and);
                    }
                    break;
                case FIELD_NAMES.limit:
                    let limit = parseInt(query[key]);

                    if (validateSkipLimit(limit)) {
                        q.limit = limit;
                    } else {
                        erros[key] = errosFormatter(key, query[key], ERROR_NAMES.limit, ERROR_MSGS.limit);
                    }
                    break;
                case FIELD_NAMES.skip:
                    let skip = parseInt(query[key]);

                    if (validateSkipLimit(skip)) {
                        q.skip = skip;
                    } else {
                        erros[key] = errosFormatter(key, query[key], ERROR_NAMES.skip, ERROR_MSGS.skip);
                    }
                    break;
                case FIELD_NAMES.sort:
                    let sortFields = query[key].split(",");
                    let sortString = sortFields.join(" ");

                    q.sort = sortString;
                    break;
                case FIELD_NAMES.select:
                    let selectFields = query[key].split(",");
                    let selectString = selectFields.join(" ");

                    q.select = selectString;
                    break;
                default:
                    q.fields[key] = returnRegExpForStrings(query[key]);
                    break;
                }
            }
        }

        req.query_handler = q;

        if (Object.keys(erros).length) {
            return next(new FormatError(erros));
        }
        return next();
    };
};
