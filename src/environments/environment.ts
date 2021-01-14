export const environment = {
    production: false,
    hmr: false,
    apiURI: "http://localhost:8083/api/",
    BASE_URI: () => {
        const protocol = window.location.protocol;
        const host = window.location.host;
        return `${protocol}//${host}`;
    },
    auth: {
        domain: "escuela-mean-stack.us.auth0.com",
        clientId: "FWiKlj4EGLUIYq0l8dlwk3SMuHMa46IR",
        // redirectUri: window.location.origin,
        redirectUri: "http://localhost:4200/callback",
        // The AuthHttpInterceptor configuration
        httpInterceptor: {
            allowedList: [
                // Attach access tokens to any calls to '/api' (exact match)
                "/api",

                // Attach access tokens to any calls that start with '/api/'
                "/api/*",
            ],
        },
    },
    NAMESPACE: 'http://myapp.com/roles'

};
