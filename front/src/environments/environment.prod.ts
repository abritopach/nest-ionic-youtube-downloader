export const environment = {
  production: true,
  // apiUrlBase: 'https://youtube-video-downloader-api.vercel.app',
  apiUrlBase: 'https://youtube-video-downloader-api.herokuapp.com',
  gapi: {
    apiKey: 'zPCc00rsESHzxfA1bQVL5D7N',
    clientId: '917936509225-euhf9snt83grlbjm8a284g1542d4rk2k.apps.googleusercontent.com',
    discoveryDocs: 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
    scope: 'https://www.googleapis.com/auth/drive'
  },
  dropbox: {
    clientId: '3yzmoowvh7mnmer',
    clientSecret: '',
    redirectUri: 'https://youtube-video-downloader-kappa.vercel.app'
  }
};
