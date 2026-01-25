import jwt from 'jsonwebtoken';
import config from '../config.js';

export const signAccessToken = (payload) => {
    return jwt.sign(payload, config.JWT_Acess_Secret, { expiresIn: '7d' });
};

export const signRefreshToken = (payload) => {
    return jwt.sign(payload, config.JWT_Refresh_Secret, { expiresIn: '7d' });
};