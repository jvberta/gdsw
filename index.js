"use strict";

require("dotenv").load();
const express = require("express");
const mongoose = require("mongoose");

const bluebird = require("bluebird");
const cors = require("cors");

const queryHandler = require("./query-handler");
const authentication = require("./authentication");
require("./oauth").AuthStrategies()
const routes = require("./routes");
const errors = require("./errors");

const port = process.env.PORT || 8080;

const db = process.env.DB_HOST;

mongoose.connect(db);
mongoose.Promise = bluebird.Promise;

const app = express();

app.use(cors());
app.use(queryHandler());
// Utiliza autenticacao por token com a excessão da rota da criacao de usuario
app.use((req, res, next) => {
    if ((req.path === "/api/usuarios" || req.path === "/auth/token") && req.method === "POST") {
        return next();
    }
    return authentication.tokenAuth()(req, res, next);
});

app.get("/teste", (req,res) => res.send("teste2"));
app.use("/api/projetos", routes.projeto);
app.use("/auth", routes.authentication())
app.use("/api/usuarios", routes.usuario);

app.use(errors.middleware());


app.listen(port, () => console.log(`Conectado a ${port}`));
