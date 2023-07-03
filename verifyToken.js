const secretKey = process.env.SECRET_JWT_KEY;
const jwt = require('jsonwebtoken');
const salt = 10;
require('dotenv').config();

const verifyToken = (req, res, next) => {


    console.log('verify token');

    console.log(req.headers.authorization);


    const token =
        req.headers.authorization && req.headers.authorization.split(' ')[1];


    if (!token) {
        return res
            .status(401)
            .json({ message: 'Access denied. Token is missing.' });
    }

    console.log('before try');

    try {

        const decodedToken = jwt.verify(token, secretKey);
        console.log('decoded Token');
        console.log(decodedToken);
        const { username, password } = decodedToken;
        req.user = { username, password };
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Access denied. Invalid token.' });
    }
};

module.exports = verifyToken;
