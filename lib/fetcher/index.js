import { envConfig } from '@/lib/config';
import axios, { pbkdf2Async, signSignaturePattern } from '@/lib/axios';
import { getSession } from 'next-auth/react';
import { METHOD } from '@/lib/endpoint';

export async function fetchAPI(method, path, body, config) {
  try {
    const _body = {
      ...body,
      timestamp: new Date().toISOString(),
    };
    const isMethodDelete = method === METHOD.DELETE;
    const res = await axios[method](
      path,
      isMethodDelete ? { data: _body } : { ..._body, ...config }
    );
    if (res.data) return res.data;
  } catch (error) {
    return error;
  }
}

export async function fetchPaymentAPI(method, path, body) {
  try {
    const res = await axios[method](envConfig.paymentGateway + path, body);
    if (res.data) return res.data;
  } catch (error) {
    return error;
  }
}

export async function fetchApiFromSSR(req, method, path, query) {
  try {
    const session = await getSession({ req });
    const isGetMethod = method === 'get';

    let _query = {
      ...query,
    };

    if (!isGetMethod) {
      _query = {
        ..._query,
        timestamp: new Date().toISOString(),
      };
    }

    const bufferSignature = await pbkdf2Async(
      signSignaturePattern(_query || {}),
      process.env.NEXT_PUBLIC_X_WILDTECH_SIGNATURE,
      1000,
      64,
      'sha512'
    );
    const hexSignature = Buffer.from(bufferSignature).toString('hex');

    let options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-wildtech-partnerid': process.env.NEXT_PUBLIC_X_WILDTECH_PARTNER_ID,
        'x-wildtech-signature': hexSignature,
      },
    };

    if (session) {
      options = {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${session?.token?.access_token}`,
        },
      };
    }

    if (!isGetMethod) {
      options = {
        ...options,
        body: JSON.stringify(_query),
      };
    }

    let apiUrl = envConfig.apiUrl;

    const res = await fetch(apiUrl + path, options);
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
}
