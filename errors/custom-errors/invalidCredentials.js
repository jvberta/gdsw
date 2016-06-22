"use strict";

/**
 * Erro que informa que usuario ou senha estao errados
 */
function InvalidCredentials() {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = "Usuario ou senha invalidos";
}

require("util").inherits(InvalidCredentials, Error);

module.exports = InvalidCredentials;
