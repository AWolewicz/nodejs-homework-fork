const User = require('../models/User');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const userJoi = Joi.object({
    password: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required()
});

const register = async (req, res, next) => {
    const { password, email } = req.body
    const user = await User.findOne({ email })
    if (user) {
        return res.status(409).json({
            status: 409,
            message: 'Email in use',
        })
    };
    const { error } = userJoi.validate(req.body);
    if (error) {
        res.status(400).json({
            status: 400,
            message: error.message
        });
    } else {
        try {
            const newUser = new User({ email })
            await newUser.setPassword(password)
            await newUser.save()
            res.status(201).json({
                status: 201,
                data: { newUser }
            })
        } catch (error) {
            next(error)
        }
    }
};

const login = async (req, res, next) => {
    const { password, email } = req.body
    const user = await User.findOne({ email })
    
    const { error } = userJoi.validate(req.body);
    if (error) {
        res.status(400).json({
            status: 400,
            message: error.message
        });
    } else {
        try {
            const isPasswordCorrect = await User.validatePassword(password)
            if (isPasswordCorrect) {
                const payload = {
                    id: user.id,
                }
                const token = jwt.sign(
                    payload,
                    process.env.SECRET,
                    { expiresIn: '12h' }
                )
                user.token = token;
                await user.save()
                return res.status(200).json({
                    token,
                    user,
                })
            }
            if (!user) {
                return res.status(401).json({
                    status: 401,
                    message: 'Email or password is wrong',
                })
            }
        } catch (error) {
            next(error)
        }
    }
};

const logout = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            status: 401,
            message: 'Not authorized',
        });
    }

    try {
        const user = await User.findOne({ token });

        if (!user) {
            return res.status(401).json({
                status: 401,
                message: 'Not authorized',
            });
        }

        user.token = null;
        await user.save();

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

const currentUser = (req, res) => {
    const { email, subscription } = req.user;

    res.status(200).json({
        email,
        subscription,
    });
};

module.exports = {
    register,
    login,
    logout,
    currentUser,
}