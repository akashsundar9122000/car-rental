import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.carrental.app',
  appName: 'SpeedsterCarRental',
  webDir: 'dist/car-rental-app/browser',
  server: {
    androidScheme: 'http',
    cleartext: true
  }
};

export default config;
