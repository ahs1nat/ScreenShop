import jwt from 'jsonwebtoken';

export const generateToken = (userId, role) => {
    const payload = { user_id: userId, role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
    return token;
};