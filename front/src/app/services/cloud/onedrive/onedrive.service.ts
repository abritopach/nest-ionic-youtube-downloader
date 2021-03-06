// Angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

// Rxjs
import { throwError, firstValueFrom, Observable, retry, catchError } from 'rxjs';

/* Project */

// Models | Interfaces
import { CloudStorageService } from '@models/cloud-storage.model';
import { AuthOneDrive, UploadFileResultOneDrive, UploadSessionOneDrive } from '@models/onedrive.model';

// Environments.
import { environment } from '@environments/environment';
import { QueryStringUtils } from '@utils/querystring.utils';
import { convertBase64ToBlob, convertBlobToArrayBuffer, handlePromise } from '@utils/utils';

@Injectable({
    providedIn: 'root'
})
export class OnedriveService implements CloudStorageService {

    private readonly ONEDRIVE_BASE_AUTH_URL = 'https://login.microsoftonline.com/common/oauth2/v2.0';
    private readonly ONEDRIVE_GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/drive';

    constructor(private http: HttpClient) { }

    async doAuth() {
        const authUrl = `${this.ONEDRIVE_BASE_AUTH_URL}/authorize?client_id=${environment.onedrive.clientId}&scope=${environment.onedrive.scope}&response_type=code&redirect_uri=${environment.onedrive.redirectUri}&state=12345&code_challenge=9qT4F-vJx-R2UATBzaT2AoQp7QiVKcn3FI1gs5KQVhc&code_challenge_method=S256`;
        window.location.href = authUrl.toString();
    }

    // If the user was just redirected from authenticating, the urls hash will
    // contain the access token.
    hasRedirectedFromAuth() {
        return !!QueryStringUtils.getCodeFromUrl();
    }


    async getToken(): Promise<AuthOneDrive> {
        console.log('OnedriveService::getToken method called');
        if (this.hasRedirectedFromAuth()) {
            const payload = new HttpParams()
                .set('client_id', environment.onedrive.clientId)
                .set('redirect_uri', environment.onedrive.redirectUri)
                .set('scope', environment.onedrive.scope)
                .set('code', QueryStringUtils.getCodeFromUrl())
                .set('grant_type', 'authorization_code')
                .set('code_verifier', 'esto es una prueba');
            return firstValueFrom(this.getAuthToken(payload))
        }
    }

    async uploadVideoOrAudio(videoInfo: {name: string; file: string; mimeType: string}) {
        const [token, tokenError] = await handlePromise(this.getToken());
        if (token) {
            const [uploadSession, uploadSessionError] = await handlePromise(firstValueFrom(this.createUploadSession(token.access_token, videoInfo)));
            const blobFile = convertBase64ToBlob(videoInfo.file,videoInfo. mimeType);
            const arrayBuffer = await convertBlobToArrayBuffer(blobFile);
            return firstValueFrom(this.uploadFile(uploadSession.uploadUrl, arrayBuffer));
        }
    }

    getAuthToken(payload: HttpParams): Observable<AuthOneDrive> {
        return this.http
        .post<AuthOneDrive>('https://login.microsoftonline.com/common/oauth2/v2.0/token', payload)
        .pipe(
            retry(3),
            catchError(this.handleError),
        );
    }

    createUploadSession(token: string, videoInfo: {name: string; file: string; mimeType: string}): Observable<UploadSessionOneDrive> {

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
        const options = { headers: headers };
        const payload = {"item": {"@microsoft.graph.conflictBehavior": "rename", name: `${videoInfo.name}.${videoInfo.mimeType.split('/').pop()}` }};

        return this.http
        .post<UploadSessionOneDrive>(`${this.ONEDRIVE_GRAPH_ENDPOINT}/root:/${videoInfo.name}.${videoInfo.mimeType.split('/').pop()}:/createUploadSession`, payload, options)
        .pipe(
            retry(3),
            catchError(this.handleError),
        );
    }

    uploadFile(uploadUrl: string, arrayBuffer: ArrayBuffer): Observable<UploadFileResultOneDrive> {

        const headers = new HttpHeaders({
            'Content-Length': arrayBuffer.byteLength.toString(),
        });
        const options = { headers: headers };

        return this.http
        .put<UploadFileResultOneDrive>(uploadUrl, arrayBuffer, options)
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

    handleError(error: HttpErrorResponse) {
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
        return throwError(() => new Error(errorMessage));
    }
}
