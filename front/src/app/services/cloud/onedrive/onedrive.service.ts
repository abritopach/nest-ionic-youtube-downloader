// Angular
import { Injectable } from '@angular/core';

/* Project */

// Models | Interfaces
import { CloudStorageService } from '@models/cloud-storage.model';

// Environments.
import { environment } from '@environments/environment';

// Utils
import { QueryStringUtils } from '@utils/querystring.utils';

@Injectable({
    providedIn: 'root'
})
export class OnedriveService implements CloudStorageService {

    private readonly ONEDRIVE_BASE_AUTH_URL = 'https://login.microsoftonline.com/common/oauth2/v2.0';

    constructor() { }

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

    async getToken() {
        // TODO: Implement this code.
    }

    uploadVideoOrAudio(videoInfo: {name: string; file: string; mimeType: string}) {
        // TODO: Implement this code.
        return Promise.resolve();
    }
}
