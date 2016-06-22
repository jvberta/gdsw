"use strict";

/**
 * Erro para validacao de algum dado informado pelo usuario
 * @param {string} model nome do modelo o qual a validacao falhou
 * @param {object} errors  objeto do tipo {
 *                        chave1: {
 *                            message:mensagem do erro,
 *                            path: propriedade que gerou o erro
 *                            value: valor atribuido
 *                        }...
 *                        }
 */
function ValidationError(model, errors) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = `a validacao do ${model} falhou`;
    this.errors = errors;

    if (!model || !errors || !Object.keys(errors).length) {
        throw new Error("Obrigatorio passar parametros model e erro no construtor ValidationError(model,error)");
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

require("util").inherits(ValidationError, Error);

module.exports = ValidationError;
