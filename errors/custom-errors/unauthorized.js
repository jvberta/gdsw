"use strict";

/**
 * * Erro de autorização de acesso
 * @param {string} modulo sistema ao qual foi negado acesso
 * @param {array} papeis aos quais sao permitidos acesso
 */
function Unauthorized(modulo, papeis) {
    Error.captureStackTrace(this, this.constructor);
    if (!modulo || !papeis) {
        throw new Error(
            "Obrigatorio passar parametros message,modulo e papeis no construtor Unauthorized(message,modulo,papeis)");
    }

    if (!Array.isArray(papeis)) {
        throw new Error("papeis deve ser do tipo array");
    }

    this.name = this.constructor.name;
    this.message = `acesso ao recurso do modulo ${modulo} permitido apenas aos perfis ${papeis.join()}`;
    this.modulo = modulo;
    this.papeis = papeis;
}

require("util").inherits(Unauthorized, Error);

module.exports = Unauthorized;
