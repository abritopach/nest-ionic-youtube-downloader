import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { CloudStorageService } from '@models/cloud-storage.model';
import { firstValueFrom } from 'rxjs';

declare var gapi: any;

@Injectable({
    providedIn: 'root'
})
export class DriveService implements CloudStorageService {

    private readonly GOOGLE_DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id';

    constructor(private http: HttpClient) { }

    doAuth(): Promise<any> {
        return new Promise((resolve, reject) => {
            gapi.load('auth2', async () => {
                const gAuth = await gapi.auth2.init({
                    apiKey: environment.GAPI.API_KEY,
                    client_id: environment.GAPI.CLIENT_ID,
                    discoveryDocs: environment.GAPI.DISCOVERY_DOCS,
                    scope: environment.GAPI.SCOPE
                });
                resolve(gAuth);
            }, reject);
        });
    }

    getToken(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const gAuth = await this.doAuth();
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

    listUserFiles() {
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

    async uploadVideoOrAudio(videoInfo: {name: string, file: Blob, mimeType: string}) {

        const token = await this.getToken();

        if (token) {
            console.log('google user', token);

            const metadata = {
                'name': videoInfo.name, // Filename at Google Drive
                mimeType: videoInfo.mimeType, // mimeType at Google Drive
                // 'parents': ['### folder ID ###'], // Folder ID at Google Drive
            };
            const formData = new FormData();
            formData.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
            formData.append('file', videoInfo.file);

            const accessToken = token.Zb.access_token; // Here gapi is used for retrieving the access token.
            const header = {
                headers: new HttpHeaders()
                .set('Authorization',  `Bearer ${accessToken}`)
            }

            return firstValueFrom(this.http.post<any>(this.GOOGLE_DRIVE_UPLOAD_URL, formData, header));
        }
    }

}
