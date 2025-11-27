import { BaseResponse } from "../api";
import { User } from "../shared/user";
import { Session } from "../api";

// Login Response
export interface LoginResponseData {
  user: User;
  session: Session;
}

export type LoginResponse = BaseResponse<LoginResponseData>;
export type ForgotPasswordResponse = BaseResponse<{ email: string }>;
export type ResetPasswordResponse = BaseResponse;