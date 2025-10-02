import InitConfig from "./initConfig";
export type Cleanup = () => void;

type InitFn = (initProps: InitConfig) => Cleanup;
export interface LaunchDarklyToolbar {
  init: InitFn;
}