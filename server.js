const express = require("express");
require("dotenv").config();
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${
      process.env.REACTU_APP_AUTH0_DOMAIN
    }/.well-known/jwks.json`
  }),

  audience: process.env.REACTU_APP_AUTH0_AUDIENCE,
  issuer: `https://${process.env.REACTU_APP_AUTH0_DOMAIN}`,

  algorithms: ["RS256"]
});

const app = express();

app.get("/public", function(request, response) {
  response.json({
    message: "Hello from a public api"
  });
});

app.get("/private", checkJwt, function(request, response) {
  response.json({
    message: "Hello from a private api"
  });
});

app.listen(3001);
console.log("API server listening on" + process.env.REACTU_APP_AUTH0_AUDIENCE);
