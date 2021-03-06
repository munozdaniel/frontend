export const environment = {
  production: false,
  hmr: false,
  apiURI: 'http://localhost:8083/api/',
  BASE_URI: () => {
    const protocol = window.location.protocol;
    const host = window.location.host;
    return `${protocol}//${host}`;
  },
};
