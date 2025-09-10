export interface ApiResponseBody<T> {
  data?: T;
  errors?: [] | object;
  message?: string;
  success: boolean;
}
