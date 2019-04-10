const express = require("express");
require("dotenv").config();
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const checkScope = require("express-jwt-authz");

const checkJwt = jwt({
  // Dynamically provide a signing key based on the kid in the header
  // and the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true, // cache the signing key
    rateLimit: true,
    jwksRequestsPerMinute: 5, // prevent attackers from requesting more than 5 per minute
    jwksUri: `https://${
      process.env.REACT_APP_AUTH0_DOMAIN
    }/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,

  // This must match the algorithm selected in the Auth0 dashboard under your app's advanced settings under the OAuth tab
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

function checkRole(role) {
  return function(req, res, next) {
    const assignedRoles = req.user["http://localhost:3000/roles"];
    if (Array.isArray(assignedRoles) && assignedRoles.includes(role)) {
      return next();
    } else {
      return res.status(401).send("Insufficient role");
    }
  };
}

app.get("/courses", checkJwt, checkScope(["read:courses"]), function(
  request,
  response
) {
  response.json({
    courses: [
      { id: 1, title: "Building apps with react and redux" },
      { id: 2, title: "Creating reusable react components" }
    ]
  });
});

app.get("/admin", checkJwt, checkRole("admin"), function(request, response) {
  response.json({
    message: "Hello from an admin api"
  });
});

app.listen(3001);
console.log("API server listening on" + process.env.REACT_APP_AUTH0_AUDIENCE);
