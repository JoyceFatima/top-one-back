import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { config } from 'src/config';
import { User } from 'src/entities';

const {
  secutiy: { bcryptSalt, jwtSecret, jwtExpire },
} = config;

export const encryptPassword = (password: string): string => {
  return bcrypt.hashSync(password, parseInt(bcryptSalt));
};

export const decryptPassword = (password: string, hash: string): boolean => {
  return bcrypt.compareSync(password, hash);
};

export const generateToken = (data: User): string => {
  return jwt.sign(data, jwtSecret, { expiresIn: jwtExpire });
};

export const decodeToken = (token: string): any => {
  return jwt.decode(token);
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, jwtSecret);
};

export const getToken = (authorization: string): string => {
  return authorization.split(' ')[1];
};

export const isTokenExpired = (token: string): boolean => {
  const { exp } = decodeToken(token);
  return exp < Date.now() / 1000;
};
