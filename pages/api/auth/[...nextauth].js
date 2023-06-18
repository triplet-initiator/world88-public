import NextAuth from 'next-auth';
import axios from '@/lib/axios';
import CredentialsProvider from 'next-auth/providers/credentials';

import { METHOD, AUTH } from '@/lib/endpoint';
import { envConfig } from 'lib/config';
import jwt from 'jsonwebtoken';
import { STATUS_CODE } from '@/lib/constants';

const useSecureCookies = process.env.NEXTAUTH_URL.startsWith('https://');
const cookiePrefix = useSecureCookies ? '__Secure-' : '';
const hostName = new URL(process.env.NEXTAUTH_URL).hostname;

export default NextAuth({
  // cookies: {
  //   sessionToken: {
  //     name: `${cookiePrefix}next-auth.session-token`,
  //     options: {
  //       httpOnly: true,
  //       sameSite: 'strict',
  //       path: '/',
  //       secure: useSecureCookies,
  //       // domain: hostName,
  //       domain:
  //         hostName == 'localhost'
  //           ? hostName
  //           : process.env.NODE_ENV === 'production'
  //           ? hostName
  //           : '.' + hostName, // add a . in front so that subdomains are included
  //     },
  //   },
  // },
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        secure: useSecureCookies,
        domain: hostName,
        // domain: hostName == 'localhost' ? hostName : '.' + hostName, // add a . in front so that subdomains are included
      },
    },
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'App-Login',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const { username, password } = req.body;
        const res = await axios.post(
          process.env.NEXT_PUBLIC_API_URI + AUTH.LOGIN,
          { username, password },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest',
              'Accept-Language': 'en-US',
            },
          }
        );
        const user = await res.data;

        if (user.code !== STATUS_CODE.Success) {
          throw new Error(user.code);
        }
        // If no error and we have user data, return it
        if (user.code === STATUS_CODE.Success) {
          return user;
        }

        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // will create env later
  },
  callbacks: {
    async jwt({ token, user }) {
      let accessToken;
      let decodeData;
      if (user) {
        accessToken = user.access_token;
        decodeData = jwt.verify(accessToken, envConfig.jwtSecret);
      }
      if (decodeData) {
        token = {
          token: {
            access_token: user.access_token,
            refresh_token: user.refresh_token,
          },
          user: decodeData,
        };
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        session.token = token.token;
        session.user = token.user;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
});
