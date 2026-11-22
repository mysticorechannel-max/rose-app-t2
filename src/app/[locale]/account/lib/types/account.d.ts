export type Gender = "MALE" | "FEMALE";

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  phone: string | null;
  firstName: string;
  lastName: string;
  gender: Gender;
  photo: string | null;
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

export interface ApiFieldError {
  path: string;
  messages: string[];
}

export interface ApiError {
  status: false;
  code: number;
  message: string;
  errors?: ApiFieldError[];
}

export interface UpdateProfileBody {
  firstName?: string;
  lastName?: string;
  phone?: string;
  photo?: string;
}

export interface UploadedImage {
  url: string;
}

export interface ChangePasswordBody {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export type ActionErrorCode =
  | "notConfigured"
  | "unauthenticated"
  | "network"
  | "badRequest"
  | "unknown";

export type ActionResult = { ok: true } | { ok: false; code: ActionErrorCode };

export type ProfileResult =
  | { ok: true; user: UserProfile }
  | { ok: false; code: ActionErrorCode };

export type FetchResult<T> = { ok: true; data: T } | { ok: false; code: ActionErrorCode };
