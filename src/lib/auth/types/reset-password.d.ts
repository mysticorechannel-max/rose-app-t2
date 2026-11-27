export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  status: boolean;
  code: number;
  message: string;
  payload: string;
}