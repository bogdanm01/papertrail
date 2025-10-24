const ACCESS_TTL_SEC = 10 * 60;
const REFRESH_TTL_SEC = 10 * 24 * 60 * 60;

const accessCookieOptions = Object.freeze({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/api',
  maxAge: ACCESS_TTL_SEC * 1000, // express excepts ms
});

const refreshCookieOptions = Object.freeze({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/api/v1/auth/refresh',
  maxAge: REFRESH_TTL_SEC * 1000,
});

export const authConsts = Object.freeze({
  ACCESS_TOKEN_NAME: 'papertrail_access',
  REFRESH_TOKEN_NAME: 'papertrail_refresh',
  TOKEN_ISSUER: 'papertrail-api',
  ACCESS_TTL_SEC,
  REFRESH_TTL_SEC,
  ACCESS_COOKIE_OPTIONS: accessCookieOptions,
  REFRESH_COOKIE_OPTIONS: refreshCookieOptions,
});
