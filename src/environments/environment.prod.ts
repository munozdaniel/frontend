export const environment = {
  production: true,
  hmr: false,
  apiURI: 'http://165.232.137.17:8083/api/',
  BASE_URI: () => {
    const protocol = window.location.protocol;
    const host = window.location.host;
    return `${protocol}//${host}`;
  },
  auth: {
    domain: 'escuela-mean-stack.us.auth0.com',
    scope: 'openid profile email',
    audience: 'http://165.232.137.17:8083/api/',
    clientId: 'FWiKlj4EGLUIYq0l8dlwk3SMuHMa46IR',
    // redirectUri: window.location.origin,
    redirectUri: 'http://165.232.137.17:4200/callback',
    // The AuthHttpInterceptor configuration
    httpInterceptor: {
      allowedList: [
        // Attach access tokens to any calls to '/api' (exact match)
        '/api',

        // Attach access tokens to any calls that start with '/api/'
        '/api/*',
      ],
    },
    namespace: 'http://myapp.com/roles',
  },
};
