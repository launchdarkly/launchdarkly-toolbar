type Environment = 'ci' | 'local';

type EnvironmentConfig = {
  [key in Environment]: {
    storyPath: string;
  };
};

const envConfig: EnvironmentConfig = {
  ci: {
    storyPath: '/?path=/story/testing-toolbar--dev-server-mode',
  },
  local: {
    storyPath: '/?path=/story/ui-launchdarklytoolbar--dev-server-mode',
  },
};

const TEST_ENV = (process.env.TEST_ENV as keyof typeof envConfig) || 'ci';

export const config = {
  testEnv: TEST_ENV,
  ...envConfig[TEST_ENV],
};
