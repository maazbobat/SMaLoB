const express = require('express');
const { getAllUsers, createUser } = require('../controllers/userController');

const router = express.Router();

router.get('/', getAllUsers);
router.post('/register', createUser);

module.exports = router;