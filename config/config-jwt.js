const passport = require('passport');
const { ExtractJwt, Strategy: jwtStrategy } = require('passport-jwt');
const User = require('../models/User');

const setJWTStrategy = () => {
    const secret = process.env.SECRET;

    const params = {
        secretOrKey: secret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }

    passport.use(
        new jwtStrategy(
            params,
            async function (payload, done) {
                try {
                    const user = await User.findOne({ id: payload.id }).lean()
                    if (!user) {
                        return done(new Error('User not found.'))
                    }
                    return done(null, user)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )
};


module.exports = setJWTStrategy