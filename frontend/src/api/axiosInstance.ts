import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  // eslint-disable-next-line no-console
  console.warn(
    'VITE_API_BASE_URL is not set. Falling back to http://localhost:5000.',
  );
}

export const api = axios.create({
  baseURL: baseURL ?? 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiBaseURL = (): string =>
  baseURL ?? 'http://localhost:5000';
