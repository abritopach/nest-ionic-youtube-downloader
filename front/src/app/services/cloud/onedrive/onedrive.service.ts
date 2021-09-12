// Angular
import { Injectable } from '@angular/core';

/* Project */

// Models | Interfaces
import { CloudStorageService } from '@models/cloud-storage.model';

// Environments.
import { environment } from '@environments/environment';

// Utils
import { QueryStringUtils } from '@utils/querystring.utils';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, Observable, retry, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class OnedriveService implements CloudStorageService {

    private readonly ONEDRIVE_BASE_AUTH_URL = 'https://login.microsoftonline.com/common/oauth2/v2.0';

    constructor(private http: HttpClient) { }

    async doAuth() {
        console.log('OnedriveService::doAuth method called');
        // https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=&response_type=code&redirect_uri=&response_mode=query&scope=openid%20offline_access%20https%3A%2F%2Fgraph.microsoft.com%2Fmail.read&state=12345
        const authUrl = `${this.ONEDRIVE_BASE_AUTH_URL}/authorize?client_id=${environment.onedrive.clientId}&response_type=code&redirect_uri=${environment.onedrive.redirectUri}&response_mode=query&scope=openid&offline_access=https://graph.microsoft.com/mail.read&state=12345`
        console.log('authUrl', authUrl);
        window.location.href = authUrl.toString();

    }

     // If the user was just redirected from authenticating, the urls hash will
    // contain the access token.
    hasRedirectedFromAuth() {
        return !!QueryStringUtils.getCodeFromUrl();
    }


    getToken() {
        console.log('OnedriveService::getToken method called');
        if (this.hasRedirectedFromAuth()) {
            const code = QueryStringUtils.getCodeFromUrl();
            const payload = new HttpParams()
                .set('client_id', environment.onedrive.clientId)
                .set('scope', 'https://graph.microsoft.com/mail.read')
                .set('redirect_uri', environment.onedrive.redirectUri)
                .set('grant_type', 'authorization_code')
                .set('client_secret', environment.onedrive.clientSecret)
                .set('code', code);
            return this.http
            .post(`${this.ONEDRIVE_BASE_AUTH_URL}/token`, payload)
            .pipe(
                retry(3),
                catchError(this.handleError),
            );
        }
    }

    uploadVideoOrAudio(videoInfo: {name: string; file: string; mimeType: string}) {
        // TODO: Implement this code.
        return Promise.resolve();
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
        return throwError(errorMessage);
    }
}
