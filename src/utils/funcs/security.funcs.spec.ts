import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { config } from '@/config';

import {
  decodeToken,
  decryptPassword,
  encryptPassword,
  generateToken,
  getToken,
  isTokenExpired,
  verifyToken,
} from './security.funcs';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const mockUser = {
  id: '123',
  name: 'Test User',
  email: 'test@example.com',
} as any;

const mockToken = 'mockJwtToken';
const mockDecodedToken = { exp: Math.floor(Date.now() / 1000) + 60 };

describe('Auth Utils', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('encryptPassword', () => {
    it('should encrypt the password', () => {
      const password = 'password123';
      const hash = 'hashedPassword';

      jest.spyOn(bcrypt, 'hashSync').mockReturnValue(hash);

      const result = encryptPassword(password);

      expect(bcrypt.hashSync).toHaveBeenCalledWith(
        password,
        parseInt(config.secutiy.bcryptSalt),
      );
      expect(result).toBe(hash);
    });
  });

  describe('decryptPassword', () => {
    it('should return true for a valid password', () => {
      const password = 'password123';
      const hash = 'hashedPassword';

      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);

      const result = decryptPassword(password, hash);

      expect(bcrypt.compareSync).toHaveBeenCalledWith(password, hash);
      expect(result).toBe(true);
    });

    it('should return false for an invalid password', () => {
      const password = 'password123';
      const hash = 'wrongHash';

      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);

      const result = decryptPassword(password, hash);

      expect(bcrypt.compareSync).toHaveBeenCalledWith(password, hash);
      expect(result).toBe(false);
    });
  });

  describe('generateToken', () => {
    it('should generate a JWT token', () => {
      jest.spyOn(jwt, 'sign').mockReturnValue();

      const result = generateToken(mockUser);

      expect(jwt.sign).toHaveBeenCalledWith(
        mockUser,
        config.secutiy.jwtSecret,
        { expiresIn: config.secutiy.jwtExpire },
      );
      expect(result).toBeUndefined();
    });
  });

  describe('decodeToken', () => {
    it('should decode a JWT token', () => {
      jest.spyOn(jwt, 'decode').mockReturnValue(mockDecodedToken);

      const result = decodeToken(mockToken);

      expect(jwt.decode).toHaveBeenCalledWith(mockToken);
      expect(result).toEqual(mockDecodedToken);
    });
  });

  describe('verifyToken', () => {
    it('should verify a JWT token', () => {
      jest.spyOn(jwt, 'verify').mockReturnValue();

      const result = verifyToken(mockToken);

      expect(jwt.verify).toHaveBeenCalledWith(
        mockToken,
        config.secutiy.jwtSecret,
      );
      expect(result).toBeUndefined();
    });
  });

  describe('getToken', () => {
    it('should extract the token from the authorization header', () => {
      const authorization = 'Bearer mockJwtToken';

      const result = getToken(authorization);

      expect(result).toBe(mockToken);
    });
  });

  describe('isTokenExpired', () => {
    it('should return false for a valid token', () => {
      jest.spyOn(jwt, 'decode').mockReturnValue(mockDecodedToken);

      const result = isTokenExpired(mockToken);

      expect(result).toBe(false);
    });

    it('should return true for an expired token', () => {
      const expiredToken = { exp: Math.floor(Date.now() / 1000) - 60 };
      jest.spyOn(jwt, 'decode').mockReturnValue(expiredToken);

      const result = isTokenExpired(mockToken);

      expect(result).toBe(true);
    });
  });
});
