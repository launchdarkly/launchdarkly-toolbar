/**
 * Utilities for parsing and serializing flag overrides from/to URL query parameters.
 *
 * URL overrides use the format: ?ldo_flagKey=value
 * - ldo_ prefix identifies LaunchDarkly override parameters
 * - Values are parsed as JSON when possible, otherwise treated as strings
 * - When serializing, strings that would parse as other types are quoted
 */

const URL_OVERRIDE_PREFIX = 'ldo_';

/**
 * Parse a URL parameter value into the appropriate type.
 * Tries JSON.parse first, falls back to string if parsing fails.
 *
 * @param urlValue - The raw value from the URL parameter
 * @returns The parsed value (boolean, number, object, array, or string)
 *
 * @example
 * parseValue('true') // => true (boolean)
 * parseValue('123') // => 123 (number)
 * parseValue('hello') // => 'hello' (string)
 * parseValue('{"key":"value"}') // => {key: 'value'} (object)
 */
function parseValue(urlValue: string): any {
  try {
    return JSON.parse(urlValue);
  } catch {
    return urlValue;
  }
}

/**
 * Serialize a value for use in a URL parameter.
 * Strings are kept as-is unless they would parse as another type.
 * All other types are JSON stringified.
 *
 * @param value - The value to serialize
 * @returns The serialized string value
 *
 * @example
 * serializeValue('hello') // => 'hello'
 * serializeValue('true') // => '"true"' (quoted to preserve as string)
 * serializeValue(true) // => 'true'
 * serializeValue(123) // => '123'
 * serializeValue({key: 'value'}) // => '{"key":"value"}'
 */
function serializeValue(value: any): string {
  if (typeof value === 'string') {
    // Check if this string would parse as something else
    try {
      JSON.parse(value);
      // If it parses successfully, it would be interpreted as non-string
      // So we need to quote it to preserve it as a string
      return JSON.stringify(value);
    } catch {
      // Doesn't parse, safe to use as-is
      return value;
    }
  }
  return JSON.stringify(value);
}

/**
 * Parse flag overrides from URL query parameters.
 * Looks for parameters with the ldo_ prefix.
 *
 * @param url - The URL to parse (defaults to window.location.href)
 * @returns Record of flag keys to override values
 *
 * @example
 * // URL: ?ldo_myFlag=true&ldo_variant=control&other=ignored
 * parseUrlOverrides()
 * // => { myFlag: true, variant: 'control' }
 */
export function parseUrlOverrides(url: string = window.location.href): Record<string, any> {
  const overrides: Record<string, any> = {};

  try {
    const urlObj = new URL(url);
    const params = urlObj.searchParams;

    params.forEach((value, key) => {
      if (key.startsWith(URL_OVERRIDE_PREFIX)) {
        const flagKey = key.substring(URL_OVERRIDE_PREFIX.length);
        if (flagKey) {
          overrides[flagKey] = parseValue(value);
        }
      }
    });
  } catch (error) {
    console.error('Failed to parse URL overrides:', error);
  }

  return overrides;
}

/**
 * Serialize flag overrides into URL query parameters.
 * Adds ldo_ prefix to each flag key.
 *
 * @param overrides - Record of flag keys to override values
 * @param baseUrl - The base URL to append parameters to (defaults to current URL without params)
 * @returns The full URL with override parameters
 *
 * @example
 * serializeUrlOverrides({ myFlag: true, variant: 'control' })
 * // => 'https://example.com?ldo_myFlag=true&ldo_variant=control'
 */
export function serializeUrlOverrides(
  overrides: Record<string, any>,
  baseUrl: string = window.location.origin + window.location.pathname,
): string {
  const url = new URL(baseUrl);

  // Preserve existing non-override query parameters
  const currentParams = new URLSearchParams(window.location.search);
  currentParams.forEach((value, key) => {
    if (!key.startsWith(URL_OVERRIDE_PREFIX)) {
      url.searchParams.set(key, value);
    }
  });

  // Add override parameters
  Object.entries(overrides).forEach(([flagKey, value]) => {
    url.searchParams.set(`${URL_OVERRIDE_PREFIX}${flagKey}`, serializeValue(value));
  });

  return url.toString();
}

/**
 * Check if the current URL contains any override parameters.
 *
 * @param url - The URL to check (defaults to window.location.href)
 * @returns True if URL contains any ldo_ parameters
 */
export function hasUrlOverrides(url: string = window.location.href): boolean {
  try {
    const urlObj = new URL(url);
    for (const key of urlObj.searchParams.keys()) {
      if (key.startsWith(URL_OVERRIDE_PREFIX)) {
        return true;
      }
    }
  } catch (error) {
    console.error('Failed to check URL overrides:', error);
  }
  return false;
}
