const accessCookieOptions = Object.freeze({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/api',
  maxAge: 0,
});

const refreshCookieOptions = Object.freeze({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/api/v1/auth/refresh',
  maxAge: 0,
});

export const authConsts = Object.freeze({
  ACCESS_TOKEN_NAME: 'papertrail_access',
  REFRESH_TOKEN_NAME: 'papertrail_refresh',
  TOKEN_ISSUER: 'papertrail-api',
  ACCESS_TTL_SEC: 10 * 60,
  REFRESH_TTL_SEC: 10 * 24 * 60 * 60,
  ACCESS_COOKIE_OPTIONS: accessCookieOptions,
  REFRESH_COOKIE_OPTIONS: refreshCookieOptions,
});
