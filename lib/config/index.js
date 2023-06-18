import getConfig from 'next/config';
const isProduction = process.env.NODE_ENV === 'production';

export const envConfig = {
  isProduction,
  node_env: process.env.NEXT_PUBLIC_NODE_ENV,
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  port: process.env.NEXT_PUBLIC_PORT,
  apiUrl: process.env.NEXT_PUBLIC_API_URI,
  nextAuthUrl: process.env.NEXTAUTH_URL,
  jwtSecret: process.env.JWT_SECRET,
  xWildtechPartnerId: process.env.NEXT_PUBLIC_X_WILDTECH_PARTNER_ID,
  xWildtechSignature: process.env.NEXT_PUBLIC_X_WILDTECH_SIGNATURE,
  paymentGateway: process.env.NEXT_PUBLIC_PAYMENT_GATEWAY,
};
