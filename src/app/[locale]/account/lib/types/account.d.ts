export type Gender = "MALE" | "FEMALE";

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  photo: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiSuccess<T> {
  status: true;
  code: number;
  payload: T;
}

export interface ApiError {
  status: false;
  code: number;
  message: string;
}