import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { menus } from '@/lib/data';
import { PERMISSION_TYPE } from './lib/constants';

const DASHBOARD_PATH = '/dashboard';
const LOGOUT_PATH = '/logout';
const LOGIN_PATH = '/login';

// More on how NextAuth.js middleware works: https://next-auth.js.org/configuration/nextjs#middleware
export default withAuth(
  function middleware(req) {
    // const session = req.nextauth.token;
    // const pathname = req.nextUrl.pathname;
    // if (session) {
    //   if (pathname === LOGIN_PATH || pathname === '/')
    //     return NextResponse.redirect(process.env.NEXT_PUBLIC_BASE_URL + DASHBOARD_PATH);
    //   if (pathname === LOGOUT_PATH) return NextResponse.next();
    //   const sourcePath = pathname.split('/').filter((v) => v)[0];
    //   const menu = menus.find((menu) => menu.key === sourcePath);
    //   const isAllowMenu = session.user.permission.allowMenu[sourcePath];
    //   if (isAllowMenu && menu.roles.includes(session.user.role)) {
    //     if (menu.children?.length) {
    //       const child = menu.children.find((item) => item.key === pathname);
    //       if (
    //         child.roles.includes(session.user.role) &&
    //         session.user.permission.menu[child.parentKey][child.permissionKey] !==
    //           PERMISSION_TYPE.DISABLE
    //       ) {
    //         // Allow child menu
    //         return NextResponse.next();
    //       } else {
    //         return NextResponse.redirect(process.env.NEXT_PUBLIC_BASE_URL + '/404');
    //       }
    //     } else {
    //       // Allow main menu
    //       return NextResponse.next();
    //     }
    //   } else {
    //     return NextResponse.redirect(process.env.NEXT_PUBLIC_BASE_URL + '/404');
    //   }
    // }
  },
  {
    callbacks: {
      // authorized() return boolean
      // managae permission for access whole menu in website
      authorized({ req, token }) {
        const path = req.nextUrl.pathname;
        const sourcePath = path.split('/')[1];
        console.log('token :', token);
        return !!token;
      },
    },
    pages: {
      signIn: '/login',
      signOut: '/logout',
    },
  }
);

export const config = {
  matcher: [
    '/logout',
    '/slot/(.*)',
    '/casino/(.*)',
    '/sport/(.*)',
    '/lotto/(.*)',
    '/promotion',
    '/cashback',
    '/payback',
    '/affiliate',
  ],
  // matcher: ['/', '/logout', '/dashboard', '/member/:path*', '/statement/:path*', '/404'],
};
