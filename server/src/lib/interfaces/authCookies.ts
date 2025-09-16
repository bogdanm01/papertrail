import type { authConst } from '../const.js';

export interface AuthCookies {
  [authConst.ACCESS_TOKEN_NAME]?: string;
  [authConst.REFRESH_TOKEN_NAME]?: string;
}
