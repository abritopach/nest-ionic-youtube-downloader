import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { sha256 } from '@utils/utils';
import { catchError, retry, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DropboxService {

    codeChallenge: string;

    constructor(private http: HttpClient) { }

    async authorizationUrl() {
        this.codeChallenge = await sha256('video-youtube-downloader');
        console.log('code-challenge', this.codeChallenge);
        return `https://www.dropbox.com/oauth2/authorize?client_id=${environment.DROPBOX.CLIENT_ID}&response_type=code&code_challenge=${this.codeChallenge}&code_challenge_method=S256&redirect_uri=http://localhost:8100`;
    }

    getToken() {

        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');

        const payload = new HttpParams()
        .set('code', '')
        .set('grant_type', 'authorization_code')
        .set('code_verifier', this.codeChallenge)
        .set('client_id', environment.DROPBOX.CLIENT_ID);

        return this.http
        .post<any>('https://api.dropboxapi.com/oauth2/token', payload, { headers })
        .pipe(
            retry(3),
            catchError(this.handleError),
        );
    }

    uploadVideoOrAudio(accessToken: string, videoInfo: {name: string, file: Blob, mimeType: string}) {
        // TODO: Add implementation
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
