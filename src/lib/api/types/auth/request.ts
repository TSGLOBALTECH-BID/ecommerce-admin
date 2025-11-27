// Login Request DTO
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean; // Optional remember me flag
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string; // For client-side validation
  acceptTerms?: boolean;   // If you have terms acceptance
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  passwordConfirm: string;
}