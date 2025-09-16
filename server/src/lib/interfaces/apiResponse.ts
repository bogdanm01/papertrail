import type { ApiResponseBody } from './apiResponseBody.js';

export interface ApiResponse<T> {
  statusHeader: number;
  responseBody: ApiResponseBody<T>;
}
