import { InitializationConfig } from '@launchdarkly/toolbar-types';
import hydrateConfig from '../utils/hydrateConfig';

const defaultConfig: InitializationConfig = hydrateConfig({});

export default defaultConfig;
