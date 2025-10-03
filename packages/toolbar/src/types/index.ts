import { InitConfig } from "./config";

export type {InitConfig};
export type Cleanup = () => void;

type InitFn = (initProps: InitConfig) => Cleanup;

export interface LaunchDarklyToolbar {
  init: InitFn;
}