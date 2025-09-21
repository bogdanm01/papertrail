import type { authConsts } from '../const.js';

export interface AuthCookies {
  [authConsts.ACCESS_TOKEN_NAME]?: string;
  [authConsts.REFRESH_TOKEN_NAME]?: string;
}
