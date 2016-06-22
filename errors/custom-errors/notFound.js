"use strict";

/**
 * Erro que informa que nao foram encontrados registros
 * @param {string} resource tipo do recurso que nao foi encontrado
 * @param {array} params parametros para os quais nao foram encontrados
 *                       os resultados
 */
function NotFound(resource, params) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = `Nenhum ${resource} foi encontrado`;
    this.usedQuery = params;

    if (!resource || !params) {
        throw new Error(
            "Obrigatorio passar parametros resource e params no construtor NotFound(resource,params)");
    }

    if ((typeof params !== "object")) {
        throw new Error("params deve ser do tipo array");
    }
}

require("util").inherits(NotFound, Error);

module.exports = NotFound;
