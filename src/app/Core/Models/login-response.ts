import { User } from "./user";

export interface LoginResponse {
  status: string;
  statusCode: number;
  message: string;
  data: User;
}