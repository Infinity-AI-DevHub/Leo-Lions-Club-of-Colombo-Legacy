import axios from 'axios';
import { API_BASE_URL } from './config';

export function adminClient(token?: string) {
  return axios.create({
    baseURL: API_BASE_URL,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}
