// Polyfills para sockjs-client
(window as any).global = window;
(window as any).process = {
  env: { DEBUG: undefined },
  version: []
}; 