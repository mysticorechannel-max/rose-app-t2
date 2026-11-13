export interface ForgotPasswordRequest {
  email: string;
  redirectUrl: string;
}

export interface ForgotPasswordResponse {
  status: boolean;
  code: number;
  message: string;
  payload: string;
}