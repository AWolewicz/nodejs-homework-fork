const express = require('express');
const { register, login, logout, currentUser, avatarUpdate } = require('../../controlers/auth');
const authMiddleware = require('../../middleware/jwt');
const uploadMiddleware = require('../../middleware/avatar');
const { verifyToken, verify } = require('../../controlers/verify');

const router = express.Router()

router.post('/users/signup', register);
router.post('/users/login', login);
router.get('/users/logout', authMiddleware, logout);
router.get('/users/current', authMiddleware, currentUser);
router.patch('/avatar', authMiddleware, uploadMiddleware.single("avatar"), avatarUpdate);
router.get('/auth/verify/:verificationToken', verifyToken);
router.post('/users/verify/', verify);

module.exports = router;