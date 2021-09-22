// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrlBase: 'http://localhost:3000',
  gapi: {
    apiKey: '9B7FSh2C_GalcCrXvmK71yYO',
    clientId: '428746507369-l9otuq91l4lj6j11q99tsugjd10d03kp.apps.googleusercontent.com',
    discoveryDocs: 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
    scope: 'https://www.googleapis.com/auth/drive'
  },
  dropbox: {
    clientId: '3yzmoowvh7mnmer',
    clientSecret: '',
    redirectUri: 'http://localhost:8100'
  },
  onedrive: {
    clientId: '280f9a20-5628-4370-b49f-bc04fd8e2d0a',
    clientSecret: '',
    redirectUri: 'http://localhost:8100',
    authority: 'https://login.microsoftonline.com/common',
    scope: 'files.readwrite files.readwrite.all sites.readwrite.all'
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
