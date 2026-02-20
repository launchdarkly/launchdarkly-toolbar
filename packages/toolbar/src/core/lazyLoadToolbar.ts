import type { LaunchDarklyToolbar } from '../index';

interface WindowWithMaybeToolbar extends Window {
  LaunchDarklyToolbar?: LaunchDarklyToolbar;
}

function getWindow(): WindowWithMaybeToolbar {
  return window;
}

export default async function lazyLoadToolbar(signal: AbortSignal, url: string): Promise<LaunchDarklyToolbar> {
  const existing = getWindow().LaunchDarklyToolbar;

  if (existing) {
    return Promise.resolve(existing);
  }

  await lazyLoad(signal, url);

  const toolbarModule = getWindow().LaunchDarklyToolbar;
  if (!toolbarModule) {
    throw new Error(`Unable to detect LaunchDarklyToolbar global from ${url}`);
  }

  return toolbarModule;
}

async function lazyLoad(signal: AbortSignal, url: string): Promise<void> {
  // Check if a script with this URL already exists
  const existingScript = document.querySelector(`script[src="${url}"]`) as HTMLScriptElement | null;

  if (existingScript) {
    // If script already exists and is loaded, return immediately
    if (existingScript.dataset.loaded === 'true') {
      return Promise.resolve();
    }

    // If script exists but is still loading, wait for it to complete
    return new Promise<void>((resolve, reject) => {
      existingScript.addEventListener('load', () => {
        if (!signal.aborted) {
          existingScript.dataset.loaded = 'true';
          resolve();
        }
      });
      existingScript.addEventListener('error', (error) => {
        if (!signal.aborted) {
          reject(error);
        }
      });
    });
  }

  // Create new script element
  const script = document.createElement('script');
  script.src = url;
  script.crossOrigin = 'anonymous';
  script.referrerPolicy = 'origin';

  const waitForLoad = new Promise<void>((resolve, reject) => {
    script.addEventListener('load', () => {
      if (!signal.aborted) {
        script.dataset.loaded = 'true';
        resolve();
      }
    });
    script.addEventListener('error', (error) => {
      if (!signal.aborted) {
        reject(error);
      }
    });
  });

  document.body.appendChild(script);

  try {
    await waitForLoad;
  } catch (error) {
    console.log(error);
    throw new Error(`Could not load LaunchDarkly developer toolbar bundle from ${url}`);
  }
}
