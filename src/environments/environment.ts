import { Capacitor } from '@capacitor/core';

export const environment = {
    production: false,
    apiUrl: Capacitor.isNativePlatform()
        ? 'http://192.168.31.45:8080/api'
        : 'http://localhost:8080/api'
};
