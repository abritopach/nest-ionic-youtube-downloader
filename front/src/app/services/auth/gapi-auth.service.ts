import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { IVideoInfo } from '@models/video.model';

declare var gapi: any;

@Injectable({
    providedIn: 'root'
})
export class GapiAuthService {

    constructor() { }

    initGapiAuth(): Promise<any> {
        return new Promise((resolve, reject) => {
            gapi.load('auth2', async () => {
                const gAuth = await gapi.auth2.init({
                    apiKey: environment.GAPI.API_KEY,
                    client_id: environment.GAPI.CLIENT_ID,
                    //fetch_basic_profile: true,
                    discoveryDocs: environment.GAPI.DISCOVERY_DOCS,
                    scope: environment.GAPI.SCOPE
                    //scope: 'profile email',
                });
                resolve(gAuth);
            }, reject);
        });
    }

    fetchGoogleUser(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const gAuth = await this.initGapiAuth();
                const oAuthUser = await gAuth.signIn({prompt: 'consent'});
                console.log('user basic profile', oAuthUser.getBasicProfile());
                //const authResponse = gAuth.currentUser.get().getAuthResponse();
                //console.log('authResponse', authResponse);
                resolve(oAuthUser);
            } catch (e) {
                reject(e);
            }
        });
    }

    listUserFilesInDrive() {
        return new Promise(async (resolve, reject) => {
            try {
                gapi.load('client', () => {
                    gapi.client.load('drive', 'v3', () => {
                        gapi.client.drive.files.list({
                            'pageSize': 10,
                            'fields': "nextPageToken, files(id, name, mimeType, createdTime, size)"
                        }).then(res => {
                            resolve(res.result.files);
                        }).catch(err => {
                            reject(err);
                        });
                    });
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    uploadVideoOrAudioToDrive(videoInfo: {name: string, file: Blob, mimeType: string}) {
        var metadata = {
            'name': videoInfo.name, // Filename at Google Drive
            mimeType: videoInfo.mimeType, // mimeType at Google Drive
            // 'parents': ['### folder ID ###'], // Folder ID at Google Drive
        };

        var accessToken = gapi.auth.getToken().access_token; // Here gapi is used for retrieving the access token.
        var form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
        form.append('file', videoInfo.file);

        var xhr = new XMLHttpRequest();
        xhr.open('post', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id');
        xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
        xhr.responseType = 'json';
        xhr.onload = () => {
            console.log(xhr.response.id); // Retrieve uploaded file ID.
        };
        xhr.send(form);
    }
}
