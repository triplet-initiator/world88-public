import { signIn } from 'next-auth/react';
import { fetchAPI } from '@/lib/fetcher';
import { METHOD, USERS } from '@/lib/endpoint';

export const UseGetBalance = async () => {
  const balance = await fetchAPI(METHOD.GET, USERS.GET_BALANCE);
  return balance;
};

export const UseSignup = async (body) => {
  const response = await fetchAPI(METHOD.POST, USERS.CREATE_MEMBER, body);
  return response;
};

export const UseGetLineId = async (body) => {
  const line = await fetchAPI(METHOD.GET, USERS.GET_LINE_ID, body);
  return line;
};

export const UseChangePassword = async (body) => {
  const response = await fetchAPI(METHOD.POST, USERS.CHANGE_PASSWORD, body);
  return response;
};
