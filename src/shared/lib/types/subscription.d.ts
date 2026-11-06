export interface SubscribePayload {
  email: string;
}

export interface SubscribeResponse {
  status: boolean;
  code: number;
  message: string;
}
