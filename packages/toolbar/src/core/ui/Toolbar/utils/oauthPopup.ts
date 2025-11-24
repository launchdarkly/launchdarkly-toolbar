const OAUTH_POPUP_WIDTH = 800;
const OAUTH_POPUP_HEIGHT = 600;

export interface OAuthPopupOptions {
  url: string;
}

export function openOAuthPopup(options: OAuthPopupOptions): Promise<string> {
  const { url } = options;

  // Calculate center position
  const left = (window.screen.width - OAUTH_POPUP_WIDTH) / 2;
  const top = (window.screen.height - OAUTH_POPUP_HEIGHT) / 2;
  let popup: WindowProxy | null = null;

  try {
    popup = window.open(
      url,
      'oauth',
      `width=${OAUTH_POPUP_WIDTH},height=${OAUTH_POPUP_HEIGHT},left=${left},top=${top},resizable=yes,scrollbars=yes`,
    );
  } catch (error) {
    console.error('Failed to open popup window. Please allow popups for this site.', error);
  }

  if (!popup) {
    throw new Error('Failed to open popup window. Please allow popups for this site.');
  }

  return new Promise<string>((resolve) => {
    let checkClosedInterval: NodeJS.Timeout;

    const cleanup = () => {
      if (checkClosedInterval) {
        clearInterval(checkClosedInterval);
      }
    };

    const handleClose = () => {
      cleanup();
      resolve('closed');
    };

    // Check if popup was closed manually
    checkClosedInterval = setInterval(() => {
      if (popup.closed) {
        handleClose();
      }
    }, 1000);
  });
}
