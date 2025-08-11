export type ProxyState = 'connecting' | 'logged-in' | 'logged-out' | 'disconnected';

export class AuthProxy {
  private _config: { origin: string };
  private _iframe: HTMLIFrameElement | null = null;
  private _port: MessagePort | null = null;
  private _state: ProxyState = 'logged-out';
  private _stateListeners: ((state: ProxyState) => void)[] = [];

  constructor(config: { origin: string }) {
    this._config = config;
    window.addEventListener('message', this._handleWindowMessage);
  }

  public setState(state: ProxyState) {
    this._state = state;
    this._stateListeners.forEach(listener => listener(state));
  }

  public getState(): ProxyState {
    return this._state;
  }

  public onStateChange(listener: (state: ProxyState) => void) {
    this._stateListeners.push(listener);
    return () => {
      this._stateListeners = this._stateListeners.filter(l => l !== listener);
    };
  }

  public setIframe(iframe: HTMLIFrameElement | null) {
    this._iframe = iframe;
  }

  public login() {
    console.log('Login requested...');
    
    // Try iframe first
    if (this._iframe?.contentWindow) {
      console.log('Sending message to iframe...');
      try {
        this._iframe.contentWindow.postMessage({
          source: 'launchdarkly-toolbar',
          message: 'request-login'
        }, '*'); // Use wildcard for local development
      } catch (error) {
        console.log('Failed to send message to iframe, using fallback:', error);
        this._openPopupDirectly();
      }
    } else {
      // Fallback: open popup directly
      console.log('No iframe available, opening popup directly...');
      this._openPopupDirectly();
    }
  }

  private _openPopupDirectly() {
    this.setState('connecting');
    
    const loginUrl = 'https://app.launchdarkly.com/login';
    const popup = window.open(
      loginUrl,
      'launchdarkly-toolbar-auth-popup',
      'popup=1,width=800,height=600,left=200,top=200,resizable=1,scrollbars=1'
    );

    if (!popup) {
      console.error('Popup was blocked!');
      alert('Popup was blocked! Please allow popups for this site and try again.');
      this.setState('logged-out');
      return;
    }

    console.log('Popup opened successfully');
    
    // Monitor popup and simulate successful login after delay
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        return;
      }
    }, 1000);
    
    // Simulate successful login after 5 seconds
    setTimeout(() => {
      if (popup && !popup.closed) {
        popup.close();
      }
      clearInterval(checkClosed);
      console.log('Simulating successful login...');
      this.setState('logged-in');
    }, 5000);
  }

  public logout() {
    console.log('Logout requested, sending message to iframe...');
    this._iframe?.contentWindow?.postMessage({
      source: 'launchdarkly-toolbar',
      message: 'request-logout'
    }, this._config.origin);
  }

  public async exec(signal: AbortSignal, method: string, args: any[]) {
    return new Promise((resolve, reject) => {
      if (!this._port) {
        reject(new Error('No message port available'));
        return;
      }

      const id = Date.now() + Math.random();
      const messageHandler = (event: MessageEvent) => {
        if (event.data.$id === id) {
          this._port?.removeEventListener('message', messageHandler);
          if (event.data.$error) {
            reject(new Error(event.data.$error));
          } else {
            resolve(event.data.$result);
          }
        }
      };

      this._port.addEventListener('message', messageHandler);
      this._port.postMessage({
        $id: id,
        message: { $function: method, $args: args }
      });

      signal.addEventListener('abort', () => {
        this._port?.removeEventListener('message', messageHandler);
        reject(new Error('Aborted'));
      });
    });
  }

  private _handleWindowMessage = (event: MessageEvent) => {
    // For local development, be more permissive with origins
    const isLocalDev = this._config.origin.includes('localhost');
    const originMatch = isLocalDev ? 
      event.origin.includes('localhost') : 
      event.origin === this._config.origin;
      
    if (!originMatch || event.data.source !== 'launchdarkly-toolbar') {
      console.log('Rejected message:', { origin: event.origin, expected: this._config.origin, source: event.data.source });
      return;
    }
    
    console.log('Received message from iframe:', event.data);
    
    switch (event.data.message) {
      case 'iframe-ready':
        console.log('Iframe is ready and communicating!');
        break;
      case 'logged-out':
      case 'logged-in':
      case 'disconnected':
        this.setState(event.data.message);
        break;
      case 'port-connect': {
        const port = event.ports[0];
        this._port = port;
        if (port) {
          port.addEventListener('message', this._handlePortMessage);
          port.start();
        }
        break;
      }
    }
  };

  private _handlePortMessage = (event: MessageEvent) => {
    // Handle API responses here if needed
    console.log('Port message received:', event.data);
  };

  public destroy() {
    window.removeEventListener('message', this._handleWindowMessage);
    this._port?.close();
  }
}