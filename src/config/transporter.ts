import nodemailer from 'nodemailer';
import { isProduction, ProdEnvSchema, DevEnvSchema } from './environment'
import * as process from 'process';

const getProdTransporter = () => {
  const env = ProdEnvSchema.parse(process.env);
  return nodemailer.createTransport({
    host: env.MAIL_HOST,
    port: env.MAIL_PORT,
    secure: env.MAIL_SECURE,
    auth: {
      user: env.MAIL_AUTH_USER,
      pass: env.MAIL_AUTH_PASS
    }
  });
}

const getDevTransproter = () => {
  const env = DevEnvSchema.parse(process.env);
  return nodemailer.createTransport({
    host: env.MAIL_HOST,
    port: env.MAIL_PORT
  });
} 

export const transporter = isProduction ? getProdTransporter() : getDevTransproter();