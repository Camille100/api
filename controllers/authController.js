/* eslint-disable no-unused-vars */
import dotenv from 'dotenv';
import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import jwtDecode from 'jwt-decode';

dotenv.config();

export const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '600s' });
}

export const register = async (req, res) => {
    if (req.body.email === undefined || req.body.password == undefined) {
        return res.status(400).json({ error: 'Missing informations' });
    }
    if (req.body.password.length < 6) {
        return res.status(400).json({ error: 'Password too short' });
    }

    User.findOne({ email: req.body.email })
    .lean()
    .exec(async (error, user) => {
      if (error) return res.status(400).json(error);
      else if (user === null) {
        const password = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            pseudo: req.body.pseudo,
            email: req.body.email,
            password,
            role: 'user',
            xp: 0,
            avatar: user.avatar
        })
        user.save()
            .then((response) => {
              return res.status(201).json(response);
            })
      } else {
        return res.status(400).json({ error: 'User already exists' });
      }
    })
}

export const login = (req, res) => {
    User.findOne({ email: req.body.email })
    .lean()
    .exec((error, user) => {
        if (error) return res.status(400).json(error);
        if (user === null) return res.status(404).json({error: 'Not found'});

        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err) return res.status(401).json(err);
            if (result === true) {
            const id = user._id.toString();
            const userInfos = { id };
            const accessToken = generateAccessToken(userInfos);
            const refreshToken = jwt.sign(userInfos, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '365d' });
            
            User.updateOne({ _id: user._id }, { $set: { refreshToken: refreshToken }})
              .lean()
              .exec((errorUpdate, update) => {
                if (errorUpdate) return res.status(400).json(errorUpdate);
                const auth = { accessToken };

                return res
                .status(200)
                .cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict', expires: new Date(Date.now() + 60 * 365 * 60000) })
                .json({
                  email: user.email,
                  pseudo: user.pseudo,
                  id: user._id,
                  role: user.role,
                  xp: user.xp,
                  ...auth
                });
              })
            } else {
              return res.status(403).json({error: 'Unauthorized'});
            }
        })
    })
}

export const refreshToken = (req, res) => {
  let refreshToken = req.cookies.refreshToken;
  const id = jwtDecode(refreshToken).id;
  if (refreshToken === null) return res.status(401).json({ error: 'Unauthorized' });
  User.findOne({ _id: id })
  .exec((err, userFound) => {
    if (err) return res.status(400).json(err);
    if (userFound === null) return res.status(401).json({ error: 'Unauthorized' });
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (errToken, user) => {
      if (errToken) return res.status(403).json(errToken);

      const userId = userFound._id.toString();
      const accessToken = generateAccessToken({ id: userId });
      return res.status(200).json({ accessToken: accessToken });
    })
  })
}

export const logout = (req, res) => {
  return res
  .status(200)
  .cookie('refreshToken', '', { httpOnly: true, secure: true, sameSite: 'strict', maxAge: -1 })
  .json({ message: 'logout successful' });
}
