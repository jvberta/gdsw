"use strict";

/**
 * Erro que informa que a aplicacao é invalida
 */
function InvalidApplication() {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = "Aplicacao invalida";
}

require("util").inherits(InvalidApplication, Error);

module.exports = InvalidApplication;
