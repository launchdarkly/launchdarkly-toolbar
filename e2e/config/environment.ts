type Environment = 'ci' | 'local';

type EnvironmentConfig = {
  [key in Environment]: {
    demoPath: string;
  };
};

const envConfig: EnvironmentConfig = {
  ci: {
    demoPath: '/ci',
  },
  local: {
    demoPath: '/',
  },
};

const TEST_ENV = (process.env.TEST_ENV as keyof typeof envConfig) || 'ci';

export const config = {
  testEnv: TEST_ENV,
  ...envConfig[TEST_ENV],
};
