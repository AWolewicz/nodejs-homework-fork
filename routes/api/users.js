const express = require('express');
const { register, login, logout, currentUser, avatarUpdate } = require('../../controlers/auth');
const authMiddleware = require('../../middleware/jwt');
const uploadMiddleware = require('../../middleware/avatar');

const router = express.Router()

router.post('/users/signup', register);
router.post('/users/login', login);
router.get('/users/logout', authMiddleware, logout);
router.get('/users/current', authMiddleware, currentUser);
router.patch('/avatar', authMiddleware, uploadMiddleware.single("avatar"), avatarUpdate);

module.exports = router;