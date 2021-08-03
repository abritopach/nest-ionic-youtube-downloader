export const environment = {
  production: true,
  // API_URL_BASE: 'https://youtube-video-downloader-api.vercel.app',
  API_URL_BASE: 'https://youtube-video-downloader-api.herokuapp.com',
  GAPI: {
    API_KEY: '',
    CLIENT_ID: '',
    DISCOVERY_DOCS: 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
    SCOPE: 'https://www.googleapis.com/auth/drive.metadata.readonly'
  }
};
