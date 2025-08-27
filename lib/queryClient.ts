// src/lib/queryClient.ts
import NetInfo from '@react-native-community/netinfo';
import { focusManager,onlineManager, QueryClient } from '@tanstack/react-query';
import { AppState } from 'react-native';

import { ApiError } from '@/lib/httpError';

onlineManager.setEventListener((setOnline) => {
    const unsub = NetInfo.addEventListener((state) => setOnline(!!state.isConnected));
    return () => unsub();
});

focusManager.setEventListener((handleFocus) => {
    const sub = AppState.addEventListener('change', (state) => handleFocus(state === 'active'));
    return () => sub.remove();
});

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 60 * 24,
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            // IMPORTANT: retry only when classified retriable
            retry: (failureCount, error) => {
                if (failureCount >= 3) return false;
                if (error instanceof ApiError) return error.retriable;
                return true; // safe fallback
            },
            retryDelay: (attempt) => Math.min(10_000, 500 * 2 ** attempt),
            networkMode: 'online',
        },
        mutations: {
            networkMode: 'online',
            retry: (failureCount, error) => {
                if (failureCount >= 2) return false;
                if (error instanceof ApiError) return error.retriable;
                return false;
            },
            retryDelay: (attempt) => Math.min(8000, 400 * 2 ** attempt),
        },
    },
});
