"use strict";

/**
 * Erro que informa que o token é invalido
 * @param {string} token token informado
 */
function InvalidToken(token) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = "Token invalido";
    this.token = token;

    if (!token) {
        throw new Error(
            "Obrigatorio passar parametros resource e params no construtor InvalidToken(resource,params)");
    }
}

require("util").inherits(InvalidToken, Error);

module.exports = InvalidToken;
