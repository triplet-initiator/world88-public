import { signIn } from 'next-auth/react';
import { fetchAPI } from '@/lib/fetcher';
import { METHOD, AUTH } from '@/lib/endpoint';
import { envConfig } from '@/lib/config';

export const UseLogin = async ({ username, password }) => {
  const _signIn = await signIn('credentials', {
    username,
    password,
    redirect: false,
    callbackUrl: '/',
  });
  return _signIn;
};

export const UseLogout = async () => {
  const logout = await fetchAPI(METHOD.POST, AUTH.LOGOUT);
  return logout;
};
