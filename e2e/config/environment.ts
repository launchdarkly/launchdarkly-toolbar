type Environment = 'ci' | 'local';

type EnvironmentConfig = {
  [key in Environment]: {
    ldBaseUrl?: string;
    ldStreamUrl?: string;
  };
};

// Default values if environment variables are not set
const DEFAULT_LD_BASE_URL = 'https://app.launchdarkly.com';
const DEFAULT_LD_STREAM_URL = 'https://clientstream.launchdarkly.com';

const envConfig: EnvironmentConfig = {
  ci: {
    ldBaseUrl: process.env.VITE_LD_BASE_URL ?? DEFAULT_LD_BASE_URL,
    ldStreamUrl: process.env.VITE_LD_STREAM_URL ?? DEFAULT_LD_STREAM_URL,
  },
  local: {
    ldBaseUrl: process.env.VITE_LD_BASE_URL ?? DEFAULT_LD_BASE_URL,
    ldStreamUrl: process.env.VITE_LD_STREAM_URL ?? DEFAULT_LD_STREAM_URL,
  },
};

const TEST_ENV = (process.env.TEST_ENV as keyof typeof envConfig) || 'ci';

export const config = {
  testEnv: TEST_ENV,
  ldBaseUrl: envConfig[TEST_ENV].ldBaseUrl,
  ldStreamUrl: envConfig[TEST_ENV].ldStreamUrl,
  ...envConfig[TEST_ENV],
};
