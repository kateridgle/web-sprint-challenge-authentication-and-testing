const router = require('express').Router();
const { checkUsernameFree, checkCredentials, checkUsernameExists } = require('./auth-middleware')
const { JWT_SECRETS } = require('../JRtolkiens/tokens');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./auth-model');


router.post('/register', checkCredentials, checkUsernameFree, (req, res, next) => {

  const { username, password } = req.body;
  const hash = bcrypt.hashSync(password, 8);
  User.add({ username, password: hash })
    .then(newUser => {
      res.status(201).json(newUser)
    }).catch(next)


});

router.post('/login', checkCredentials, checkUsernameExists, (req, res, next) => {
  
  if (bcrypt.compareSync(req.body.password, req.user.password)){
    const token = buildToken(req.user)
    res.json({
      message: `welcome, ${req.user.username}`,
      token
    });
  } else {
    next({ status: 401, message: 'invalid credentials'})
  }


});



function buildToken(user){
  const payload = {
    subject: user.id,
    username: user.username
  }
  const options = {
    expiresIn: '1d',
  }
  return jwt.sign(payload, JWT_SECRETS, options)
}

module.exports = router;