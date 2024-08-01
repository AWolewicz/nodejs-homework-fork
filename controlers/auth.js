const User = require('../models/User');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const gravatar = require("gravatar");
const Jimp = require("jimp");
const fs = require("fs/promises");
const path = require("path");
const { v4: uuidV4 } = require("uuid");

const userJoi = Joi.object({
    password: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required()
});

const register = async (req, res, next) => {
    const { password, email } = req.body
    const { error } = userJoi.validate(req.body);
    if (error) {
        res.status(400).json({
            status: 400,
            message: error.message
        });
    };
    const user = await User.findOne({ email })
    if (user) {
        return res.status(409).json({
            status: 409,
            message: 'Email in use',
        });
    }
    try {
        const avatar = gravatar.url(email, { s: "250", r: "pg", d: "404" });
        const newUser = new User({ email })
        newUser.avatarURL = avatar;
        await newUser.setPassword(password)
        await newUser.save()
        res.status(201).json({
            status: 201,
            data: { newUser }
        });
        } catch (error) {
            next(error)
    };
};

const login = async (req, res, next) => {
    const { password, email } = req.body
    const { error } = userJoi.validate(req.body);
    if (error) {
        res.status(400).json({
            status: 400,
            message: error.message
        });
    };
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(401).json({
            status: 401,
            message: 'Email or password is wrong',
        })
    };
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
        } catch (error) {
            next(error)
        }
    };

const logout = async (req, res, next) => {
    const { token } = req.user;
    try {
        const user = await User.findOne({ token });

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

const avatarUpdate = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        };
        const storeImageDir = path.join(process.cwd(), "public/avatars");
        const { path: tempPath } = req.file;
        const extension = path.extname(tempPath);
        const fileName = `${uuidV4()}${extension}`;
        const filePath = path.join(storeImageDir, fileName);

        const image = await Jimp.read(tempPath);
        await image.resize(250, 250).writeAsync(filePath);
        await fs.unlink(tempPath);

        const avatarURL = `/avatars/${fileName}`;

        req.user.avatarURL = avatarURL;
        await req.user.save();

        res.status(200).json({ avatarURL });
    } catch (error) {
        next(error);
    };
};

module.exports = {
    register,
    login,
    logout,
    currentUser,
    avatarUpdate,
}