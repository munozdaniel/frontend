export const environment = {
  production: true,
  hmr: false,
  apiURI: 'http://localhost:8081/api/',
  BASE_URI: () => {
    const protocol = window.location.protocol;
    const host = window.location.host;
    return `${protocol}//${host}`;
  },
};
