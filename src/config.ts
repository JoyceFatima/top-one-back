import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  database: {
    databaseUrl: process.env.DATABASE_URL,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    port: process.env.DATABASE_PORT,
    pass: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
  },
  api: {
    port: process.env.PORT,
  },
  secutiy: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpire: process.env.JWT_EXPIRES_IN,
    bcryptSalt: process.env.BCRYPT_SALT,
  },
  email: {
    brevoApiKey: process.env.BREVO_API_KEY,
    brevoSenderEmail: process.env.BREVO_FROM_EMAIL,
  },
};
