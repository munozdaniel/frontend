export const environment = {
  production: true,
  hmr: false,
  apiURI: 'http://165.232.137.17:8083/api/',
  BASE_URI: () => {
    const protocol = window.location.protocol;
    const host = window.location.host;
    return `${protocol}//${host}`;
  },
 
};
