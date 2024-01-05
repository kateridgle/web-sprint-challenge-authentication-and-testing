const { JWT_SECRET, JWT_SECRETS } = require('../JRtolkiens/tokens')
const jwt = require('jsonwebtoken')

module.exports = async(req, res, next) => {
  const token = req.headers.authorization

  if(!token){
    return next({ status: 401, message: 'token required'})
  }

  jwt.verify(token, JWT_SECRETS, (err) => {
    if(err){
      next({ status: 401, message: 'token invalid'})
    } else {
      next()
    }
  })
};