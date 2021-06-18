export const environment = {
  production: true,
  hmr: false,
  apiURI: 'http://app.cet30.edu.ar:8081/api/',
  url: 'http://app.cet30.edu.ar:8081/api/',
  apiUpload: 'http://app.cet30.edu.ar:8081/',
  BASE_URI: () => {
    const protocol = window.location.protocol;
    const host = window.location.host;
    return `${protocol}//${host}`;
  },
};
