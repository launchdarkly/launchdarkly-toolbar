let eventSource: EventSource | null = null;

export function enableHotReload() {
  // Avoid multiple connections
  if (eventSource) {
    return;
  }

  try {
    eventSource = new EventSource('http://localhost:8080/hot-reload');

    eventSource.onopen = () => {
      console.log('🔄 Hot reload connected to mock server');
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'connected') {
          console.log('✅ Hot reload connection established');
        } else if (data.type === 'reload') {
          console.log(`🔄 Toolbar file changed: ${data.file}`);
          console.log('🔄 Reloading page to get updated toolbar...');

          // Small delay to ensure file is fully written
          setTimeout(() => {
            window.location.reload();
          }, 100);
        }
      } catch {
        console.warn('Hot reload: Failed to parse message', event.data);
      }
    };

    eventSource.onerror = (error) => {
      console.warn('🔄 Hot reload connection error:', error);

      // Try to reconnect after a delay
      setTimeout(() => {
        if (eventSource?.readyState === EventSource.CLOSED) {
          console.log('🔄 Attempting to reconnect hot reload...');
          eventSource = null;
          enableHotReload();
        }
      }, 2000);
    };
  } catch (error) {
    console.warn('Failed to establish hot reload connection:', error);
  }
}

export function disableHotReload() {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
    console.log('🔄 Hot reload disconnected');
  }
}

// Auto-enable hot reload in development
if (import.meta.env.DEV) {
  enableHotReload();
}
