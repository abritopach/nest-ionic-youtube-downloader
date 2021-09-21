// Angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

// Rxjs
import { BehaviorSubject, catchError, retry, throwError, firstValueFrom } from 'rxjs';

// Third parties
import { MsalService } from '@azure/msal-angular';

/* Project */

// Models | Interfaces
import { CloudStorageService } from '@models/cloud-storage.model';
import { AuthOneDrive } from '@models/onedrive.model';

// Environments.
import { environment } from '@environments/environment';
import { QueryStringUtils } from '@utils/querystring.utils';

@Injectable({
    providedIn: 'root'
})
export class OnedriveService implements CloudStorageService {

    authenticationState = new BehaviorSubject(<AuthOneDrive>{});

    private readonly ONEDRIVE_BASE_AUTH_URL = 'https://login.microsoftonline.com/common/oauth2/v2.0';
    private readonly ONEDRIVE_GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/drive/root:/video.mp4:/createUploadSession';
    private readonly ME_GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';

    constructor(private http: HttpClient, private authService: MsalService) { }

    async doAuth() {
        console.log('OnedriveService::doAuth method called');
        // const scope = 'onedrive.readonly onedrive.readwrite onedrive.appfolder';
        // const authUrl = `https://login.live.com/oauth20_authorize.srf?client_id=${environment.onedrive.clientId}&scope=${scope}&response_type=code&redirect_uri=${environment.onedrive.redirectUri}`;
        const scope = 'files.readwrite files.readwrite.all sites.readwrite.all';
        const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${environment.onedrive.clientId}&scope=${scope}&response_type=code&redirect_uri=${environment.onedrive.redirectUri}&state=12345&code_challenge=9qT4F-vJx-R2UATBzaT2AoQp7QiVKcn3FI1gs5KQVhc&code_challenge_method=S256`;
        console.log('authUrl', authUrl);
        window.location.href = authUrl.toString();
        // return this.authService.loginPopup();
    }

    // If the user was just redirected from authenticating, the urls hash will
    // contain the access token.
    hasRedirectedFromAuth() {
        return !!QueryStringUtils.getCodeFromUrl();
    }


    async getToken() {
        console.log('OnedriveService::getToken method called');
        if (this.hasRedirectedFromAuth()) {
            const payload = new HttpParams()
                .set('client_id', environment.onedrive.clientId)
                .set('redirect_uri', environment.onedrive.redirectUri)
                .set('scope', 'files.readwrite files.readwrite.all sites.readwrite.all')
                //.set('client_secret', encodeURI(environment.onedrive.clientSecret))
                .set('code', QueryStringUtils.getCodeFromUrl())
                .set('grant_type', 'authorization_code')
                .set('code_verifier', 'esto es una prueba');

            // firstValueFrom(this.http.post('https://login.live.com/oauth20_token.srf', payload))
            return firstValueFrom(this.http.post('https://login.microsoftonline.com/common/oauth2/v2.0/token', payload))
        }
        //return this.authenticationState.value;
    }

    async uploadVideoOrAudio(videoInfo: {name: string; file: Blob; mimeType: string}) {

        const token = await this.getToken();

        if (token) {
            console.log('token', token);

            const headers = new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token['access_token']}`
            });
            const options = { headers: headers };
            const payload = {"item": {"@microsoft.graph.conflictBehavior": "rename", name: "video.mp4" }};

            return firstValueFrom(this.http.post(this.ONEDRIVE_GRAPH_ENDPOINT, payload, options));
        }

        /*
        this.doAuth().subscribe({
            next: (result: AuthOneDrive) => {
                console.log(result.accessToken);
                this.authenticationState.next(result);
                this.me(result.accessToken);
                const headers = new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${result.accessToken}`
                });
                const options = { headers: headers };
                const payload = {"item": {"@microsoft.graph.conflictBehavior": "rename", name: "video.mp4" }};

                return firstValueFrom(this.http.post(this.ONEDRIVE_GRAPH_ENDPOINT, payload, options));
            },
            error: (error) => console.log(error)
        });
        */
    }

    me(accessToken: string) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        });
        const options = { headers: headers };
        this.http.get(this.ME_GRAPH_ENDPOINT, options)
        .subscribe(profile => {
            console.log(profile);
        });
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
