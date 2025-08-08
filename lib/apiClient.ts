import { API_BASE_URL } from '@/config/api';
import { log } from '@/lib/logger';
import { ApiResponse, create } from 'apisauce';

const apiClient = create({
    baseURL: API_BASE_URL,
    headers: { 'Accept': 'application/json' },
});

// Log outgoing requests
apiClient.addRequestTransform(request => {
    const { method, url } = request;
    //    log.info(method?.toUpperCase(), url?.substring(API_BASE_URL.length));
});

// Log responses
apiClient.addMonitor((response: ApiResponse<any>) => {
    const { config, problem, duration } = response;
    const { method, url } = config || {};

    if (problem) {
        log.error('API Response Error', { method, url, problem, duration, data: response.data });
    }
});

export { apiClient };
