import { InitializationConfig } from '../types';
import mount from './mount';
import hydrateConfig from './utils/hydrateConfig';
import './globals.css';

export type Cleanup = () => void;

export function init(config: InitializationConfig): Cleanup {
  return mount(document.body, hydrateConfig(config));
}
