const express = require('express');
const { register, login, logout, currentUser } = require('../../controlers/auth');
const authMiddleware = require('../../middleware/jwt');

const router = express.Router()

router.post('/users/signup', register);
router.post('/users/login', login);
router.get('/users/logout', authMiddleware, logout);
router.get('/users/current', authMiddleware, currentUser);

module.exports = router;