import { AUTH, METHOD } from '@/lib/endpoint';
import { LOGOUT_CODE, STATUS_CODE } from '@/lib/constants';
import { fetchApiFromSSR } from '@/lib/fetcher';
import { getSession } from 'next-auth/react';

export function withAuth(gssp) {
  return async (context) => {
    const { req, res } = context;
    const session = await getSession({ req });
    // context = { ...context, session, isAuth: !!session?.token?.access_token };
    try {
      const res = await fetchApiFromSSR(req, METHOD.GET, AUTH.CHECK_SESSION);
      if (res && [...LOGOUT_CODE].includes(res.code)) {
        context = { ...context, authStatus: res };
      }
      context = { ...context, isAuth: res.code === STATUS_CODE.Success };
    } catch (err) {
      console.error(err);
    }

    return await gssp(context);
  };
}

export function setupLogOutUrl({ authStatus }) {
  if (authStatus)
    return `/logout?message=${encodeURIComponent(authStatus.msg.split(' ').join('-'))}`;
  return '';
}
