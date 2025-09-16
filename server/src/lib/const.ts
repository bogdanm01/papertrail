export const authConst = Object.freeze({
  ACCESS_TOKEN_NAME: 'papertrail_access',
  REFRESH_TOKEN_NAME: 'papertrail_refresh',
  TOKEN_ISSUER: 'papertrail-api',
  ACCESS_TTL_SEC: 10 * 60,
  REFRESH_TTL_SEC: 10 * 24 * 60 * 60,
});
