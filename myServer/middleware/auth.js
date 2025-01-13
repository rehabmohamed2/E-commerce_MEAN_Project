const jwt = require('jsonwebtoken');


const isAuthenticated = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token verified:', decoded);
        req.user = decoded; 
        next();
    } catch (error) {
        console.error('JWT verification failed:', error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
};


const isAdmin = (req, res, next) => {

};

module.exports = { isAuthenticated, isAdmin };
