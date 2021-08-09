import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { sha256 } from '@utils/utils';
import { catchError, retry, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DropboxService {

    constructor(private http: HttpClient) { }

    authenticateUser() {
        return this.http
        // https://www.dropbox.com/oauth2/authorize?response_type=token&client_id=cg750anjts67v15&redirect_uri=https%3A%2F%2Fdropbox.github.io%2Fdropbox-api-v2-explorer%2F&state=auth_token%2Ffrom_oauth1!jFJJ4s1vZAKhFysZFuLOZat4&token_access_type=online&
        .get<any>(`https://www.dropbox.com/oauth2/authorize?client_id=${environment.DROPBOX.CLIENT_ID}&response_type=code&code_challenge=${sha256('video-youtube-downloader')}&code_challenge_method=S256&redirect_uri='http://localhost:8100/'`)
        .pipe(
            retry(3),
            catchError(this.handleError),
        );
    }

    uploadVideoOrAudio(accessToken: string, videoInfo: {name: string, file: Blob, mimeType: string}) {
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
