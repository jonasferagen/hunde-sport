import { API_BASE_URL } from '@/config/api';
import { log } from '@/services/Logger';
import { ApiResponse, create } from 'apisauce';

const apiClient = create({
    baseURL: API_BASE_URL,
    headers: { 'Accept': 'application/json' },
});

apiClient.addMonitor((response: ApiResponse<any>) => {
    const { config, problem } = response;
    const { method, url } = config || {};

    const m = method?.toUpperCase();

    if (problem) {
        log.error(m, url, problem, { data: response.data });
        throw new Error(problem);
    } else {
        log.info(m, url);
    }


});

export { apiClient };
