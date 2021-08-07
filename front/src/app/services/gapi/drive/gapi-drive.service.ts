import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { catchError, Observable, retry, throwError } from 'rxjs';

declare var gapi: any;

@Injectable({
    providedIn: 'root'
})
export class GapiDriveService {

    private readonly GOOGLE_DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id';

    constructor(private http: HttpClient) { }

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

    uploadVideoOrAudio(user: any, videoInfo: {name: string, file: Blob, mimeType: string}): Observable<any> {
        const metadata = {
            'name': videoInfo.name, // Filename at Google Drive
            mimeType: videoInfo.mimeType, // mimeType at Google Drive
            // 'parents': ['### folder ID ###'], // Folder ID at Google Drive
        };
        const formData = new FormData();
        formData.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
        formData.append('file', videoInfo.file);

        const accessToken = user.Zb.access_token; // Here gapi is used for retrieving the access token.
        const header = {
            headers: new HttpHeaders()
            .set('Authorization',  `Bearer ${accessToken}`)
        }

        return this.http
        .post<any>(this.GOOGLE_DRIVE_UPLOAD_URL, formData,
        header)
        .pipe(
            retry(3),
            catchError(this.handleError),
        );
    }

    /**
     * Description [This method handles api endpoints errors.]
     *
     * @author abrito
     * @version 0.0.1
     *
     * @method
     * @name handleError
     * @param error - Api endpoint response error.
     * @returns {Observable}.
     */

    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'Unknown error!';
        if (error.error instanceof ErrorEvent) {
            // Client-side errors.
            errorMessage = `Error: ${error.error.message}`;
            console.log(`Error: ${error.error.message}`);
        } else {
            // Server-side errors.
            // errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
            if (error) {
                console.error( `Error Code: ${error?.status}\nMessage: ${error?.message}`);
                errorMessage = `Error: ${error.error?.message}`;
            }
        }
        return throwError(() => Error(errorMessage));
    }

}
