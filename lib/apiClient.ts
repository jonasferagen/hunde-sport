import { API_BASE_URL } from '@/config/api';
import { create } from 'apisauce';

const apiClient = create({
    baseURL: API_BASE_URL,
    headers: { 'Accept': 'application/json' },
});

export default apiClient;