export const environment = {
  production: true,
  // apiUrlBase: 'https://youtube-video-downloader-api.vercel.app',
  apiUrlBase: 'https://youtube-video-downloader-api.herokuapp.com',
  gapi: {
    apiKey: '9B7FSh2C_GalcCrXvmK71yYO',
    clientId: '428746507369-l9otuq91l4lj6j11q99tsugjd10d03kp.apps.googleusercontent.com',
    discoveryDocs: 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
    scope: 'https://www.googleapis.com/auth/drive'
  },
  dropbox: {
    clientId: '3yzmoowvh7mnmer',
    clientSecret: '',
    redirectUri: 'https://youtube-video-downloader-kappa.vercel.app'
  },
  onedrive: {
    clientId: '',
    client_secret: '',
    redirectUri: 'http://localhost:8100',
    grant_type: "refresh_token",
    refresh_token: ''
  }
};
