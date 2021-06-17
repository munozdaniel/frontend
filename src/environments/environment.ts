export const environment = {
  production: false,
  hmr: false,
  apiURI: 'http://localhost:8081/api/',
  url: 'http://localhost:8081/api/',
  apiUpload: 'http://localhost:8081/',
  BASE_URI: () => {
    const protocol = window.location.protocol;
    const host = window.location.host;
    return `${protocol}//${host}`;
  },
};
