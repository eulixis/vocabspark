import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vocabspark.app',
  appName: 'VocabSpark',
  webDir: 'dist',
  server: {
    url: 'https://83d4fa86-0bbe-48a9-995b-905f8746b5dc.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
};

export default config;