const jwt = require('jsonwebtoken')
const JWT_TOKENS = require('../JRtolkiens/tokens')

module.exports = (req, res, next) => {
  
    const token = req.headers.authorization
    if(!token){
     return next({status:401, message:'Token is required'})
    }
    jwt.verify(token, JWT_TOKENS, (err, decodedToken) => {
      if(err){
        next({status:401, message:'token is invalid'})
      } else {
        req.decodedToken = decodedToken
        next()
      }
    })
  };
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */

