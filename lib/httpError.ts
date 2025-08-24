// src/lib/httpError.ts
export class ApiError extends Error {
    status?: number;
    problem?: string;
    retriable: boolean;
    isNetworkError: boolean;

    constructor(message: string, opts: {
        status?: number;
        problem?: string;
        retriable?: boolean;
        isNetworkError?: boolean;
    } = {}) {
        super(message);
        this.name = 'ApiError';
        this.status = opts.status;
        this.problem = opts.problem;
        this.retriable = !!opts.retriable;
        this.isNetworkError = !!opts.isNetworkError;
    }
}

export function isRetriable(problem?: string, status?: number) {
    // apisauce problems:
    // 'TIMEOUT_ERROR' | 'CONNECTION_ERROR' | 'NETWORK_ERROR' | 'SERVER_ERROR' | 'CLIENT_ERROR' | 'CANCEL_ERROR' | 'UNKNOWN_ERROR'
    if (!problem) return false;
    if (problem === 'TIMEOUT_ERROR' || problem === 'CONNECTION_ERROR' || problem === 'NETWORK_ERROR') return true;
    if (problem === 'SERVER_ERROR') return true; // 5xx
    if (status === 408 || status === 429) return true;
    return false;
}
