type Environment = 'ci' | 'local';

type EnvironmentConfig = {
  [key in Environment]: {
    storyPath: string;
  };
};

const envConfig: EnvironmentConfig = {
  ci: {
    storyPath: '/?path=/story/testing-toolbar--default',
  },
  local: {
    storyPath: '/?path=/story/ui-launchdarklytoolbar--default',
  },
};

const TEST_ENV = (process.env.TEST_ENV as keyof typeof envConfig) || 'ci';

export const config = {
  testEnv: TEST_ENV,
  ...envConfig[TEST_ENV],
};
