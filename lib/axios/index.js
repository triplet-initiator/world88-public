import Axios from 'axios';
import { getSession, getCsrfToken } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { LOGOUT_CODE } from '@/lib/constants';
import crypto from 'crypto';
import { envConfig } from '@/lib/config';

export function signSignaturePattern(body) {
  const signature = `${process.env.NEXT_PUBLIC_X_WILDTECH_PARTNER_ID}:${JSON.stringify(body)}`;
  return signature;
}

export function pbkdf2Async(password, salt, iterations, keylen, digest) {
  return new Promise((res, rej) => {
    crypto.pbkdf2(password, salt, iterations, keylen, digest, (err, key) => {
      err ? rej(err) : res(key);
    });
  });
}

const AxiosInstance = () => {
  const instance = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URI,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json ',
      'x-wildtech-partnerid': process.env.NEXT_PUBLIC_X_WILDTECH_PARTNER_ID,
      // 'x-wildtech-signature': process.env.NEXT_PUBLIC_X_WILDTECH_SIGNATURE,
    },
  });

  instance.interceptors.request.use(async (request) => {
    const session = await getSession();
    // const csrfToken = await getCsrfToken();

    const bufferSignature = await pbkdf2Async(
      signSignaturePattern(request.data || {}),
      process.env.NEXT_PUBLIC_X_WILDTECH_SIGNATURE,
      1000,
      64,
      'sha512'
    );

    const hexSignature = Buffer.from(bufferSignature).toString('hex');
    request.headers['x-wildtech-signature'] = hexSignature;

    if (session) {
      request.headers.Authorization = `Bearer ${session.token.access_token}`;
      // request.headers['csrf-token'] = csrfToken;
    }
    return request;
  });

  instance.interceptors.response.use(
    (response) => {
      if ([...LOGOUT_CODE].includes(response.data.code)) {
        setTimeout(async () => {
          await signOut({ callbackUrl: '/login' });
          sessionStorage.clear();
        }, 2000);
      }
      return response;
    },
    (error) => {
      throw error.response.data;
    }
  );

  return instance;
};

export default AxiosInstance();
