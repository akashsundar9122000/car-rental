import { Capacitor } from '@capacitor/core';

export const environment = {
    production: true,
    apiUrl: Capacitor.isNativePlatform()
        ? 'http://192.168.31.45:8080/api'
        : 'https://RAILWAY_BACKEND_URL/api'
};
