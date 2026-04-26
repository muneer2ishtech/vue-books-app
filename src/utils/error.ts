import type { AxiosError } from 'axios';

export function getApiErrorMessage(error: unknown): string {
  const e = error as AxiosError<{ message?: string }>;
  if (!e.response) return 'Connection error - please check your connection';
  return e.response.data?.message || e.response.statusText || 'Unexpected error';
}
