"use strict";

/**
 * Erro para validacao do formato dos dados
  * @param {object} errors  objeto do tipo {
 *                        chave1: {
 *                            message:mensagem do erro,
 *                            path: propriedade que gerou o erro
 *                            value: valor atribuido
 *                        }...
 *                        }
 */
function FormatError(errors) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = `Erro no formato dos dados`;
    this.errors = errors;

    if (!errors || !Object.keys(errors).length) {
        throw new Error("Obrigatorio passar parametro erro no construtor FormatError(errors)");
    }

    let invalidKeys = [];

    Object.keys(errors).forEach(key => {
        if (!errors[key].hasOwnProperty("message") ||
            !errors[key].hasOwnProperty("path") ||
            !errors[key].hasOwnProperty("value")
            ) {
            invalidKeys.push(key);
        }
    });

    if (invalidKeys.length) {
        throw new Error(`As chaves ${invalidKeys.join()} devem conter as propriedades message, path e value`);
    }
}

require("util").inherits(FormatError, Error);

module.exports = FormatError;
