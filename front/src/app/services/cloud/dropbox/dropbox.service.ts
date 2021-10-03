// Angular
import { Injectable } from '@angular/core';

// Third parties
import { Dropbox, DropboxAuth } from 'dropbox';

/* Project */

// Models
import { IDropboxTokenResonse } from '@models/dropbox.model';

// Environments
import { environment } from '@environments/environment';

// Utils
import { QueryStringUtils } from '@utils/querystring.utils';
import { convertBase64ToBlob } from '@utils/utils';
import { CloudStorageService } from '@models/cloud-storage.model';

@Injectable({
    providedIn: 'root'
})
export class DropboxService implements CloudStorageService {

    dbxAuth: DropboxAuth;

    constructor() {
        this.dbxAuth = new DropboxAuth({
            clientId: environment.dropbox.clientId,
        });
    }

    // Get authentication url as following
    async doAuth() {
        try {
            const authUrl = await this.dbxAuth.getAuthenticationUrl(environment.dropbox.redirectUri, undefined,
                'code', 'offline', undefined, undefined, true);
            window.sessionStorage.setItem('codeVerifier', this.dbxAuth.getCodeVerifier());
            window.location.href = authUrl.toString();
        } catch (error) {
            return console.error(error);
        }
    }

    // If the user was just redirected from authenticating, the urls hash will
    // contain the access token.
    hasRedirectedFromAuth() {
        return !!QueryStringUtils.getCodeFromUrl();
    }

    async getToken() {
        if (this.hasRedirectedFromAuth()) {
            this.dbxAuth.setCodeVerifier(window.sessionStorage.getItem('codeVerifier'));
            return this.dbxAuth.getAccessTokenFromCode(environment.dropbox.redirectUri,
                QueryStringUtils.getCodeFromUrl())
                .then((response) => {
                    const tokenData = response.result as IDropboxTokenResonse;
                    this.dbxAuth.setAccessToken(tokenData.access_token);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }

    uploadVideoOrAudio(videoInfo: {name: string; file: string; mimeType: string}) {
        const dbx = new Dropbox({
            auth: this.dbxAuth
        });
        const blobFile = convertBase64ToBlob(videoInfo.file,videoInfo. mimeType);
        return dbx.filesUpload({contents: blobFile, path:
            `/${videoInfo.name}.${videoInfo.mimeType.split('/').pop()}`, autorename: false, mute: true });
    }

}
