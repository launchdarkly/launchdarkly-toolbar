type Environment = 'ci' | 'local';

type EnvironmentConfig = {
  [key in Environment]: {};
};

const envConfig: EnvironmentConfig = {
  ci: {},
  local: {},
};

const TEST_ENV = (process.env.TEST_ENV as keyof typeof envConfig) || 'ci';

export const config = {
  ...envConfig[TEST_ENV],
};
