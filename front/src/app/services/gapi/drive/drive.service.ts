import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { CloudStorageService } from '@models/cloud-storage.model';
import { firstValueFrom } from 'rxjs';

declare let gapi: any;

@Injectable({
    providedIn: 'root'
})
export class DriveService implements CloudStorageService {

    private readonly googleDriveUploadUrl = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id';

    constructor(private http: HttpClient) { }

    doAuth(): Promise<gapi.auth2.GoogleAuth> {
        return new Promise((resolve, reject) => {
            gapi.load('auth2', async () => {
                const gAuth: gapi.auth2.GoogleAuth = await gapi.auth2.init({
                    apiKey: environment.gapi.apiKey,
                    /* eslint-disable @typescript-eslint/naming-convention */
                    client_id: environment.gapi.clientId,
                    discoveryDocs: environment.gapi.discoveryDocs,
                    scope: environment.gapi.scope
                });
                resolve(gAuth);
            }, reject);
        });
    }

    getToken(): Promise<string> {
        return new Promise((resolve, reject) => {
            try {
                this.doAuth().then(gAuth => {
                    console.log('gAuth', gAuth);
                    gAuth.signIn({prompt: 'consent'}).then(oAuthUser => {
                        console.log('user basic profile', oAuthUser.getBasicProfile());
                        //const authResponse = gAuth.currentUser.get().getAuthResponse();
                        //console.log('authResponse', authResponse);
                        resolve(oAuthUser.getAuthResponse().access_token);
                    });
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    listUserFiles() {
        return new Promise(async (resolve, reject) => {
            try {
                gapi.load('client', () => {
                    gapi.client.load('drive', 'v3', () => {
                        gapi.client.drive.files.list({
                            pageSize: 10,
                            fields: 'nextPageToken, files(id, name, mimeType, createdTime, size)'
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

    async uploadVideoOrAudio(videoInfo: {name: string; file: Blob; mimeType: string}) {

        const token = await this.getToken();

        if (token) {
            console.log('token', token);

            const metadata = {
                name: `${videoInfo.name}.${videoInfo.mimeType.split('/').pop()}`, // Filename at Google Drive
                mimeType: videoInfo.mimeType, // mimeType at Google Drive
                // 'parents': ['### folder ID ###'], // Folder ID at Google Drive
            };
            const formData = new FormData();
            formData.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
            formData.append('file', videoInfo.file);

            const accessToken = token; // Here gapi is used for retrieving the access token.
            const header = {
                headers: new HttpHeaders()
                .set('Authorization',  `Bearer ${accessToken}`)
            };

            return firstValueFrom(this.http.post<any>(this.googleDriveUploadUrl, formData, header));
        }
    }

}
