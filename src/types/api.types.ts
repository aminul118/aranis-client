import { IUser } from '@/services/user/user.interface';

export interface ILogin {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

export interface IMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface IErrorSources {
  path: string | number;
  message: string;
}

export interface ApiResponse<T> {
  message: string;
  statusCode: number;
  success: boolean;
  data: T;
  meta?: IMeta;
  errorSources?: IErrorSources[];
}

export interface Auth {
  provider: string;
  providerId: string;
}
