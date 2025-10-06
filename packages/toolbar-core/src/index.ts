import { InitializationConfig } from "@launchdarkly/toolbar-types";
import mount from "./mount";
import hydrateConfig from "./utils/hydrateConfig";
import './globals.css';

export type Cleanup = () => void;

export function init(config: InitializationConfig): Cleanup {
  const { mountPoint } = config;
  const root = typeof mountPoint === 'function' ? mountPoint() : mountPoint;

  return mount(root ?? document.body, hydrateConfig(config));
}
