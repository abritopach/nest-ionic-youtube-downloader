export const environment = {
  production: true,
  // apiUrlBase: 'https://youtube-video-downloader-api.vercel.app',
  apiUrlBase: 'https://youtube-video-downloader-api.herokuapp.com',
  gapi: {
    apiKey: '',
    clientId: '',
    discoveryDocs: 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
    scope: 'https://www.googleapis.com/auth/drive'
  },
  dropbox: {
    clientId: '',
    clientSecret: '',
    redirectUri: 'http://localhost:8100'
  }
};
