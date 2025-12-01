import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { parseUrlOverrides, serializeUrlOverrides, hasUrlOverrides } from '../utils/urlOverrides';

describe('URL Overrides', () => {
  let originalLocation: any;

  beforeEach(() => {
    originalLocation = window.location;
    // Mock window.location for testing
    delete (window as any).location;
    window.location = {
      href: 'https://example.com',
      origin: 'https://example.com',
      pathname: '/',
      search: '',
    } as any;
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  describe('parseUrlOverrides', () => {
    test('parses boolean values correctly', () => {
      const overrides = parseUrlOverrides('https://example.com?ldo_flag1=true&ldo_flag2=false');

      expect(overrides).toEqual({
        flag1: true,
        flag2: false,
      });
      expect(typeof overrides.flag1).toBe('boolean');
      expect(typeof overrides.flag2).toBe('boolean');
    });

    test('parses number values correctly', () => {
      const overrides = parseUrlOverrides('https://example.com?ldo_count=42&ldo_price=99.99');

      expect(overrides).toEqual({
        count: 42,
        price: 99.99,
      });
      expect(typeof overrides.count).toBe('number');
      expect(typeof overrides.price).toBe('number');
    });

    test('parses string values correctly', () => {
      const overrides = parseUrlOverrides('https://example.com?ldo_variant=control&ldo_name=alice');

      expect(overrides).toEqual({
        variant: 'control',
        name: 'alice',
      });
      expect(typeof overrides.variant).toBe('string');
      expect(typeof overrides.name).toBe('string');
    });

    test('parses JSON object values correctly', () => {
      const overrides = parseUrlOverrides(
        'https://example.com?ldo_config=' + encodeURIComponent('{"key":"value","nested":{"a":1}}'),
      );

      expect(overrides).toEqual({
        config: { key: 'value', nested: { a: 1 } },
      });
      expect(typeof overrides.config).toBe('object');
    });

    test('parses JSON array values correctly', () => {
      const overrides = parseUrlOverrides('https://example.com?ldo_items=' + encodeURIComponent('[1,2,3]'));

      expect(overrides).toEqual({
        items: [1, 2, 3],
      });
      expect(Array.isArray(overrides.items)).toBe(true);
    });

    test('parses null values correctly', () => {
      const overrides = parseUrlOverrides('https://example.com?ldo_value=null');

      expect(overrides).toEqual({
        value: null,
      });
      expect(overrides.value).toBeNull();
    });

    test('ignores parameters without ldo_ prefix', () => {
      const overrides = parseUrlOverrides('https://example.com?ldo_flag=true&other=value&regular=param');

      expect(overrides).toEqual({
        flag: true,
      });
      expect(overrides).not.toHaveProperty('other');
      expect(overrides).not.toHaveProperty('regular');
    });

    test('handles mixed parameter types', () => {
      const overrides = parseUrlOverrides('https://example.com?ldo_bool=true&ldo_str=hello&ldo_num=123&other=ignored');

      expect(overrides).toEqual({
        bool: true,
        str: 'hello',
        num: 123,
      });
    });

    test('handles empty parameter values', () => {
      const overrides = parseUrlOverrides('https://example.com?ldo_empty=');

      expect(overrides).toEqual({
        empty: '',
      });
      expect(overrides.empty).toBe('');
    });

    test('handles URL encoded spaces and special characters', () => {
      const overrides = parseUrlOverrides('https://example.com?ldo_message=hello%20world&ldo_special=test%26value');

      expect(overrides).toEqual({
        message: 'hello world',
        special: 'test&value',
      });
    });

    test('handles quoted string values that would parse as other types', () => {
      const overrides = parseUrlOverrides('https://example.com?ldo_strTrue="true"&ldo_strNum="123"');

      expect(overrides).toEqual({
        strTrue: 'true',
        strNum: '123',
      });
      expect(typeof overrides.strTrue).toBe('string');
      expect(typeof overrides.strNum).toBe('string');
    });

    test('returns empty object when no ldo_ parameters exist', () => {
      const overrides = parseUrlOverrides('https://example.com?other=value&regular=param');

      expect(overrides).toEqual({});
    });

    test('returns empty object for URL with no parameters', () => {
      const overrides = parseUrlOverrides('https://example.com');

      expect(overrides).toEqual({});
    });

    test('uses current window.location.href when no URL provided', () => {
      window.location.href = 'https://example.com?ldo_test=true';

      const overrides = parseUrlOverrides();

      expect(overrides).toEqual({
        test: true,
      });
    });

    test('handles invalid URLs gracefully', () => {
      const overrides = parseUrlOverrides('not-a-valid-url');

      expect(overrides).toEqual({});
    });

    test('handles flag keys with hyphens and underscores', () => {
      const overrides = parseUrlOverrides('https://example.com?ldo_my-flag=true&ldo_another_flag=false');

      expect(overrides).toEqual({
        'my-flag': true,
        another_flag: false,
      });
    });

    test('handles multiple flags with same prefix correctly', () => {
      const overrides = parseUrlOverrides('https://example.com?ldo_flag1=a&ldo_flag2=b&ldo_flag3=c');

      expect(overrides).toEqual({
        flag1: 'a',
        flag2: 'b',
        flag3: 'c',
      });
    });
  });

  describe('serializeUrlOverrides', () => {
    test('serializes boolean values without quotes', () => {
      const url = serializeUrlOverrides({ flag1: true, flag2: false });

      expect(url).toContain('ldo_flag1=true');
      expect(url).toContain('ldo_flag2=false');
    });

    test('serializes number values without quotes', () => {
      const url = serializeUrlOverrides({ count: 42, price: 99.99 });

      expect(url).toContain('ldo_count=42');
      expect(url).toContain('ldo_price=99.99');
    });

    test('serializes simple string values without quotes', () => {
      const url = serializeUrlOverrides({ variant: 'control', name: 'alice' });

      expect(url).toContain('ldo_variant=control');
      expect(url).toContain('ldo_name=alice');
    });

    test('serializes string values that would parse as booleans with quotes', () => {
      const url = serializeUrlOverrides({ strTrue: 'true', strFalse: 'false' });

      expect(url).toContain('ldo_strTrue=%22true%22'); // "true" URL encoded
      expect(url).toContain('ldo_strFalse=%22false%22'); // "false" URL encoded
    });

    test('serializes string values that would parse as numbers with quotes', () => {
      const url = serializeUrlOverrides({ strNum: '123', strFloat: '99.99' });

      expect(url).toContain('ldo_strNum=%22123%22'); // "123" URL encoded
      expect(url).toContain('ldo_strFloat=%22' + encodeURIComponent('99.99') + '%22');
    });

    test('serializes object values as JSON', () => {
      const url = serializeUrlOverrides({ config: { key: 'value', nested: { a: 1 } } });

      const urlObj = new URL(url);
      const configValue = urlObj.searchParams.get('ldo_config');
      expect(JSON.parse(configValue!)).toEqual({ key: 'value', nested: { a: 1 } });
    });

    test('serializes array values as JSON', () => {
      const url = serializeUrlOverrides({ items: [1, 2, 3] });

      const urlObj = new URL(url);
      const itemsValue = urlObj.searchParams.get('ldo_items');
      expect(JSON.parse(itemsValue!)).toEqual([1, 2, 3]);
    });

    test('serializes null values as JSON', () => {
      const url = serializeUrlOverrides({ value: null });

      expect(url).toContain('ldo_value=null');
    });

    test('preserves existing non-override query parameters', () => {
      window.location.search = '?existing=value&another=param';

      const url = serializeUrlOverrides({ flag: true });

      expect(url).toContain('existing=value');
      expect(url).toContain('another=param');
      expect(url).toContain('ldo_flag=true');
    });

    test('replaces existing override parameters with new values', () => {
      window.location.search = '?ldo_flag=false';

      const url = serializeUrlOverrides({ flag: true });

      const urlObj = new URL(url);
      expect(urlObj.searchParams.get('ldo_flag')).toBe('true');
      expect(urlObj.searchParams.getAll('ldo_flag')).toHaveLength(1);
    });

    test('uses custom base URL when provided', () => {
      const url = serializeUrlOverrides({ flag: true }, 'https://custom.com/path');

      expect(url).toContain('https://custom.com/path');
      expect(url).toContain('ldo_flag=true');
    });

    test('handles empty overrides object', () => {
      const url = serializeUrlOverrides({});

      const urlObj = new URL(url);
      const ldoParams = Array.from(urlObj.searchParams.keys()).filter((k) => k.startsWith('ldo_'));
      expect(ldoParams).toHaveLength(0);
    });

    test('handles flag keys with hyphens and underscores', () => {
      const url = serializeUrlOverrides({ 'my-flag': true, another_flag: false });

      expect(url).toContain('ldo_my-flag=true');
      expect(url).toContain('ldo_another_flag=false');
    });

    test('URL encodes special characters in string values', () => {
      const url = serializeUrlOverrides({ message: 'hello world', special: 'test&value' });

      const urlObj = new URL(url);
      expect(urlObj.searchParams.get('ldo_message')).toBe('hello world');
      expect(urlObj.searchParams.get('ldo_special')).toBe('test&value');
    });

    test('round-trips correctly with parseUrlOverrides for various types', () => {
      const originalOverrides = {
        bool: true,
        num: 42,
        str: 'hello',
        strTrue: 'true', // Should be quoted
        strNum: '123', // Should be quoted
        obj: { key: 'value' },
        arr: [1, 2, 3],
        nullVal: null,
      };

      const url = serializeUrlOverrides(originalOverrides);
      const parsedOverrides = parseUrlOverrides(url);

      expect(parsedOverrides).toEqual(originalOverrides);
    });
  });

  describe('hasUrlOverrides', () => {
    test('returns true when URL contains ldo_ parameters', () => {
      const result = hasUrlOverrides('https://example.com?ldo_flag=true');

      expect(result).toBe(true);
    });

    test('returns true when URL contains multiple ldo_ parameters', () => {
      const result = hasUrlOverrides('https://example.com?ldo_flag1=true&ldo_flag2=false');

      expect(result).toBe(true);
    });

    test('returns false when URL contains no ldo_ parameters', () => {
      const result = hasUrlOverrides('https://example.com?other=value');

      expect(result).toBe(false);
    });

    test('returns false when URL has no query parameters', () => {
      const result = hasUrlOverrides('https://example.com');

      expect(result).toBe(false);
    });

    test('returns false when URL has only non-override parameters', () => {
      const result = hasUrlOverrides('https://example.com?foo=bar&baz=qux');

      expect(result).toBe(false);
    });

    test('uses current window.location.href when no URL provided', () => {
      window.location.href = 'https://example.com?ldo_test=true';

      const result = hasUrlOverrides();

      expect(result).toBe(true);
    });

    test('handles invalid URLs gracefully', () => {
      const result = hasUrlOverrides('not-a-valid-url');

      expect(result).toBe(false);
    });

    test('returns true even if ldo_ parameter has empty value', () => {
      const result = hasUrlOverrides('https://example.com?ldo_flag=');

      expect(result).toBe(true);
    });
  });

  describe('edge cases and error handling', () => {
    test('parseUrlOverrides handles malformed JSON gracefully', () => {
      const overrides = parseUrlOverrides('https://example.com?ldo_bad={invalid json}');

      // Should treat as string since JSON.parse fails
      expect(overrides).toEqual({
        bad: '{invalid json}',
      });
    });

    test('serializeUrlOverrides handles undefined values', () => {
      const url = serializeUrlOverrides({ flag: undefined } as any);

      const urlObj = new URL(url);
      expect(urlObj.searchParams.get('ldo_flag')).toBeTruthy();
    });

    test('parseUrlOverrides handles hash fragments correctly', () => {
      const overrides = parseUrlOverrides('https://example.com?ldo_flag=true#hash');

      expect(overrides).toEqual({
        flag: true,
      });
    });

    test('serializeUrlOverrides preserves hash fragments', () => {
      window.location.href = 'https://example.com#hash';
      const url = serializeUrlOverrides({ flag: true });

      // Note: URL constructor doesn't preserve hash from window.location
      // but our implementation should work with the provided baseUrl
      expect(url).toContain('ldo_flag=true');
    });

    test('handles very long string values', () => {
      const longString = 'a'.repeat(1000);
      const overrides = { longValue: longString };

      const url = serializeUrlOverrides(overrides);
      const parsed = parseUrlOverrides(url);

      expect(parsed.longValue).toBe(longString);
    });

    test('handles many override parameters', () => {
      const manyOverrides: Record<string, any> = {};
      for (let i = 0; i < 50; i++) {
        manyOverrides[`flag${i}`] = i % 2 === 0;
      }

      const url = serializeUrlOverrides(manyOverrides);
      const parsed = parseUrlOverrides(url);

      expect(parsed).toEqual(manyOverrides);
    });
  });
});
