const { check } = require('express-validator');

exports.validateSignup = [
  check('email').isEmail().normalizeEmail(),
  check('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*\d)(?=.*[a-zA-Z]).*$/)
];

exports.validateLogin = [
  check('email').isEmail().normalizeEmail(),
  check('password').exists()
];