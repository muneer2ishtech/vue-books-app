import { http } from './http';

export function signin(payload: { email: string; password: string }) {
  return http.post<{ token_type: string; access_token: string }>('/api/v1/auth/signin', payload);
}

export function signup(payload: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirm: string;
  lang: string;
  acceptTermsConditions: boolean;
}) {
  return http.post('/api/v1/auth/signup', payload);
}
