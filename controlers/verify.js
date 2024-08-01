const User = require('../models/User');
const { sendEmail } = require('../email');
const Joi = require('joi');

const emailJoi = Joi.object({
    email: Joi.string().email().required()
})

const verifyToken = async (req, res, next) => {
    const { verificationToken } = req.user;
    try {
        const user = await User.findOne({ verificationToken });
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: 'User not found',
            })
        };

        user.verificationToken = null;
        user.verify = true;
        await user.save();

        res.status(200).json({
            status: 200,
            message: 'Verification successful',
        })
    } catch (error) {
        next(error)
    }
};

const verify = async (req, res, next) => {
    const { email } = req.body;
    const { error } = emailJoi.validate({ email });
    if (error) {
        return res.status(400).json({
            status: 400,
            message: 'missing required field email',
        });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                status: 404,
                message: 'User not found',
            });
        }

        if (user.verify) {
            return res.status(400).json({
                status: 400,
                message: 'Verification has already been passed',
            });
        }

        await sendEmail(user.email, user.verificationToken);

        res.status(200).json({
            status: 200,
            message: 'Verification email sent',
        });
    } catch (error) {
        next(error);
    };
};

module.exports = {
    verifyToken,
    verify,
}