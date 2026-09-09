import jsonwebtoken from 'jsonwebtoken';

export const generateToken = (id) => {
    return jsonwebtoken.sign({ id }, process.env.SECRET_KEY, { expiresIn: '1d' });
};