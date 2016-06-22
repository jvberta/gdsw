"use strict";
// dependencies
const oauth2orize = require("oauth2orize");
const passport = require("passport");

const models = require("../models");
const errors = require("../errors");

const AccessToken = models.accessToken;
const RefreshToken = models.refreshToken;
const ValidationError = errors.customErrors.ValidationError;
const InvalidToken = errors.customErrors.InvalidToken;

const authenticate = require("./authenticate");

const tokenExpirationTimeInSeconds = 1800;

let OauthServer;

OauthServer = function () {
    // create OAuth 2.0 server
    const server = oauth2orize.createServer();

    server.exchange(oauth2orize.exchange.password(
        (client, username, password, scope, done) => {
            const options = {};
            let token;

            authenticate.local(username, password)
                .then(user => AccessToken.createToken(user._id, client._id, scope))
                .then(accessToken => {
                    // set the expiration time for the token
                    options.expires_in = Date.now() + tokenExpirationTimeInSeconds;

                    token = accessToken.token;
                    return RefreshToken.createToken(accessToken.userId,
                                                           accessToken.applicationId,
                                                           accessToken._id);
                })
                .then(refreshToken => done(null, token, refreshToken.token, options))
                .catch(err => done(err, false));
        }
    ));

    server.exchange(oauth2orize.exchange.refreshToken(
        (client, tokenId, scope, done) => {
            const token = tokenId;

            let refreshToken;
            let accessToken;

            const options = {};

            RefreshToken.findByToken(token)
                .then(rToken => {
                    if (!rToken) {
                        throw new InvalidToken(rToken);
                    }

                    if (String(rToken.applicationId) !== String(client._id)) {
                        throw new Error("The Token does not belong to the application");
                    }

                    refreshToken = rToken;
                    accessToken = rToken.accessTokenId;

                    return AccessToken.findByIdAndRemove(rToken.accessTokenId);
                })
                .then(() => AccessToken.createToken(refreshToken.userId,
                                                            refreshToken.applicationId,
                                                            accessToken.scope))
                .then(aToken => {
                    options.expires_in = Date.now() + tokenExpirationTimeInSeconds;
                    options.scope = aToken.scope;

                    accessToken = aToken;
                    refreshToken.accessTokenId = aToken._id;

                    return refreshToken.save();
                })
                .then(() => done(null, accessToken.token, refreshToken.token, options))
                .catch(err => done(err, false));
        }
  ));

    return {
        token: [
            passport.authenticate(["basic", "oauth2-client-password"], {session: false}),
            server.token()
        ]
    };
};

module.exports = OauthServer;
