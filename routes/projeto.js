"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const router = new express.Router();

const projetoCtrl = require("../controllers/projeto");

router.use(bodyParser.json());

router.route("/")
    .get(projetoCtrl.index)
    .post(projetoCtrl.create);

router.route("/me")
    .get(projetoCtrl.showProjetosByUsuario);

router.route("/:idProjeto")
    .get(projetoCtrl.show)
    .put(projetoCtrl.update);

router.route("/:idProjeto/candidatos/me")
    .post(projetoCtrl.candidatarSeAoProjeto)
    .delete(projetoCtrl.descandidatarSeDoProjeto);

    router.route("/:idProjeto/escolhidos")
        .post(projetoCtrl.escolherCandidato);




module.exports = router;