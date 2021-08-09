// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  API_URL_BASE: 'http://localhost:3000',
  GAPI: {
    API_KEY: '',
    CLIENT_ID: '',
    DISCOVERY_DOCS: 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
    SCOPE: 'https://www.googleapis.com/auth/drive.metadata.readonly'
  },
  DROPBOX: {
    CLIENT_ID: ''
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
