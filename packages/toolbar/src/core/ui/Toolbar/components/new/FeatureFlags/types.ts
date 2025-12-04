import { ApiVariation } from '../../../types/ldApi';

export interface NormalizedFlag {
  key: string;
  name: string;
  isOverridden: boolean;
  type: 'boolean' | 'multivariate' | 'string' | 'number' | 'object';
  currentValue: any;
  availableVariations: ApiVariation[];
}
