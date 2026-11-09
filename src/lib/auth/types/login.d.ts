
export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  gender: "MALE" | "FEMALE";
  emailVerified: boolean;
  phoneVerified: boolean;
  role: string;
}

export interface LoginResponse {
  status: boolean;
  code: number;
  payload: {
    user: AuthUser;
    token: string;
  };
}
