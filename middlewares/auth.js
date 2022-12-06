import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

export const authenticateUser = (req, res, next) => {
    // console.log('bloup3');
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token === null) return res.status(403).json({ error: 'Unauthorized' });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        
        if (err) return res.status(403).json('Unauthorized');

        req.user = user;
        next();
    })
}

// export const autenticateAdmin = (req, res, next) => {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     if (token === null) res.status(401).json({ error: 'Unauthorized' });

//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//         if (err) res.status(401).json('Unauthorized');

//         req.user = user;
//         next();
//     })
// }