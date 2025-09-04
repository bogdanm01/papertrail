export interface ApiResponseBody<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: [] | object;
}
