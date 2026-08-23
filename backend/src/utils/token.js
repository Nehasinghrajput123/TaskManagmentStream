const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_ACCESS_SECRET || 'fallback_access_secret_key',
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m'
        }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user._id
        },
        process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret_key',
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'
        }
    );
};

const verifyAccessToken = (token) => {
    return jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET || 'fallback_access_secret_key'
    );
};

const verifyRefreshToken = (token) => {
    return jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret_key'
    );
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
};