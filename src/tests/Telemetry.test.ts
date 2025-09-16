import { describe, it, expect } from 'vitest';
import { telemetry } from '../services';

describe('Telemetry', () => {
  it('initialize and track should not throw', () => {
    expect(() => {
      telemetry.initialize({ enabled: true, samplingRate: 1 });
      telemetry.track('test_event', { ok: true });
      telemetry.flush();
    }).not.toThrow();
  });
});
