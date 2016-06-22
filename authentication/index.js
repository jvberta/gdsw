"use strict";

/**
 * Module dependencies.
 */

const passport = require("passport");
const BearerStrategy = require("passport-http-bearer").Strategy;

const models = require("../models");
const errors = require("../errors").customErrors;

const InvalidToken = errors.InvalidToken;

    /**
     * BearerStrategy
     *
     * This strategy is used to authenticate users based on an access token (aka a
     * bearer token).  The user must have previously authorized a client
     * application, which is issued an access token to make requests on behalf of
     * the authorizing user.
     */
passport.use(new BearerStrategy((accessToken, done) => {
    models.accessToken.getByTokenPopulated(accessToken)
        .then(token => {
            if (!token) {
                return done(new InvalidToken(accessToken), false);
            }
            const info = {scope: token.scope};

            return done(null, token.userId, info);
        })
        .catch(err => {
            done(err);
        });
}));

exports.initialize = function () {
    return passport.initialize();
};

exports.tokenAuth = function () {
    return passport.authenticate("bearer", {session: false});
};
