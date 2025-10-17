/**
 * Utility function to detect if Do Not Track is enabled
 * Based on the same logic used in LaunchDarkly SDK
 *
 * @returns {boolean} true if Do Not Track is enabled, false otherwise
 */
export function isDoNotTrackEnabled(): boolean {
  let flag;
  if (typeof window !== 'undefined' && window.navigator) {
    if (window.navigator.doNotTrack !== undefined) {
      flag = window.navigator.doNotTrack; // FF, Chrome
    } else if ((window.navigator as any).msDoNotTrack !== undefined) {
      flag = (window.navigator as any).msDoNotTrack; // IE 9/10
    } else {
      flag = (window as any).doNotTrack; // IE 11+, Safari
    }
  }

  return flag === 1 || flag === true || flag === '1' || flag === 'yes';
}
