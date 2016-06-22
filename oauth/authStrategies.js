"use strict";

/**
 * Module dependencies.
 */

const passport = require("passport");
const BasicStrategy = require("passport-http").BasicStrategy;
const ClientPasswordStrategy = require("passport-oauth2-client-password").Strategy;

const applicationModel = require("../models").application;
const InvalidApplication = require("../errors").customErrors.InvalidApplication;

let AuthStrategies;

AuthStrategies = function () {
    /**
     * BasicStrategy & ClientPasswordStrategy
     *
     * These strategies are used to authenticate registered OAuth clients.  They are
     * employed to protect the `token` endpoint, which consumers use to obtain
     * access tokens.  The OAuth 2.0 specification suggests that clients use the
     * HTTP Basic scheme to authenticate.  Use of the client password strategy
     * allows clients to send the same credentials in the request body (as opposed
     * to the `Authorization` header).  While this approach is not recommended by
     * the specification, in practice it is quite common.
     */
    function auth(clientId, clientSecret, done) {
        applicationModel.findOne({clientId})
            .then(app => {
                if (!app) {
                    return done(new InvalidApplication(), false);
                } else if (!app.checkSecret(clientSecret)) {
                    return done(new InvalidApplication(), false);
                }
                return done(null, app);
            })
            .catch(done);
    }

    passport.use(new BasicStrategy(auth));

    passport.use(new ClientPasswordStrategy(auth));

    return passport;
};

module.exports = AuthStrategies;
