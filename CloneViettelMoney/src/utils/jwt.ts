/* eslint-disable no-bitwise */
import * as jwt from 'jsonwebtoken';
export const JWT_SECRET = process.env.JWT_SECRET_KEY || 'XpngPWWW7dwmWrGzAqRE';

type JWTDecoded = {
  id: string;
  exp: number;
};

export const JWT_EXPIRES_IN = 3600 * 24 * 2;

export const sign = (
  payload: Record<string, any>,
  privateKey: string,
  header: Record<string, any>
) => {
  const now = new Date();
  header.expiresIn = new Date(now.getTime() + header.expiresIn);
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = btoa(
    Array.from(encodedPayload)
      .map((item, key) =>
        String.fromCharCode(
          item.charCodeAt(0) ^ privateKey[key % privateKey.length].charCodeAt(0)
        )
      )
      .join('')
  );

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

export const decode = (token: string): any => {
  const [encodedHeader, encodedPayload, signature] = token.split('.');
  const header = JSON.parse(atob(encodedHeader));
  const payload = JSON.parse(atob(encodedPayload));
  const now = new Date();

  if (now < header.expiresIn) {
    throw new Error('Expired token');
  }

  const verifiedSignature = btoa(
    Array.from(encodedPayload)
      .map((item, key) =>
        String.fromCharCode(
          item.charCodeAt(0) ^ JWT_SECRET[key % JWT_SECRET.length].charCodeAt(0)
        )
      )
      .join('')
  );

  if (verifiedSignature !== signature) {
    throw new Error('Invalid signature');
  }

  return payload;
};

export const verify = (
  token: string,
  privateKey: string
): Record<string, any> => {
  const [encodedHeader, encodedPayload, signature] = token.split('.');
  const header = JSON.parse(atob(encodedHeader));
  const payload = JSON.parse(atob(encodedPayload));
  const now = new Date();

  if (now < header.expiresIn) {
    throw new Error('The token is expired!');
  }

  const verifiedSignature = btoa(
    Array.from(encodedPayload)
      .map((item, key) =>
        String.fromCharCode(
          item.charCodeAt(0) ^ privateKey[key % privateKey.length].charCodeAt(0)
        )
      )
      .join('')
  );

  if (verifiedSignature !== signature) {
    throw new Error('The signature is invalid!');
  }

  return payload;
};

function verifyJWT(param: { token: string; secretKey: string; algorithm?: jwt.Algorithm[] }): any {
  const options: any = {};
  if (param.algorithm) options.algorithms = param.algorithm;

  return jwt.verify(param.token, param.secretKey, options);
}

export const verifyToken = async (
  token: string,
  privateKey: string
): Promise<boolean> => {
  const decoded: JWTDecoded = verifyJWT({
    token: token,
    secretKey: privateKey
  });

  if (!decoded?.id) throw new Error("The token is invalid!");

  const now = new Date();

  if (now.getTime() < decoded.exp) {
    throw new Error("The token is expored!")
  }
  
  return true
}
