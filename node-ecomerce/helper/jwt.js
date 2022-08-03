const expressJwt = require("express-jwt");

function authJwt() {
  secret = process.env.secret;
  api = process.env.API_URL;
  return expressJwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked
  }).unless({
    path: [
      { url: /\/public\/categories(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/categories(.*)/, methods: ["GET", "OPTIONS"] },
      `${api}v1/users/login`,
      `${api}/v1/users/register`,
    ],
  });
}

async function isRevoked(req, payload, done){
  if(!payload.isAdmin){
    done(null, true)
  }
  done();
}
module.exports = authJwt;
