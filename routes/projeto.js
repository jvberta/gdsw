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

router.route("/me/candidato")
    .get(projetoCtrl.showProjetosQueUsuarioSeCandidatou);

router.route("/:idProjeto")
    .get(projetoCtrl.show)
    .put(projetoCtrl.update);

router.route("/:idProjeto/candidatos/me")
    .post(projetoCtrl.candidatarSeAoProjeto)
    .delete(projetoCtrl.descandidatarSeDoProjeto);

router.route("/:idProjeto/escolhidos")
    .post(projetoCtrl.escolherCandidato);

router.route("/:idProjeto/messages/from/me/to/:userId")
    .post(projetoCtrl.enviarMsg);

router.route("/:idProjeto/entrevista/me/with/:withUser")
    .get(projetoCtrl.listarEntrevista);

router.route("/:idProjeto/status/finalizado")
    .put(projetoCtrl.encerrarProjeto);

module.exports = router;
