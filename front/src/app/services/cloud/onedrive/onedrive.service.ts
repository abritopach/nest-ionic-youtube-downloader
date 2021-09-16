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

@Injectable({
    providedIn: 'root'
})
export class OnedriveService implements CloudStorageService {

    authenticationState = new BehaviorSubject(<AuthOneDrive>{});

    private readonly ONEDRIVE_BASE_AUTH_URL = 'https://login.microsoftonline.com/common/oauth2/v2.0';
    private readonly ONEDRIVE_GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/drive/root/createUploadSession';
    private readonly ME_GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';

    constructor(private http: HttpClient, private authService: MsalService) { }

    doAuth() {
        console.log('OnedriveService::doAuth method called');
        return this.authService.loginPopup();
    }


    getToken() {
        console.log('OnedriveService::getToken method called');
        return this.authenticationState.value;
    }

    async uploadVideoOrAudio(videoInfo: {name: string; file: Blob; mimeType: string}) {

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
                const payload = {item: {"@microsoft.graph.conflictBehavior": "rename", name: "video.mp4" }};

                return firstValueFrom(this.http.post(this.ONEDRIVE_GRAPH_ENDPOINT, payload, options));
            },
            error: (error) => console.log(error)
        });
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
