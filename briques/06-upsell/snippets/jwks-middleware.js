const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 10,
    jwksUri: process.env.MOLAM_ID_JWKS || "http://molam-id-mock:3000/.well-known/jwks.json",
  }),
  audience: process.env.MOLAM_ID_AUDIENCE || "molam-shop",
  issuer: process.env.MOLAM_ID_ISSUER || "https://molam-id",
  algorithms: ["RS256"],
  credentialsRequired: false,
});

module.exports = { checkJwt };
