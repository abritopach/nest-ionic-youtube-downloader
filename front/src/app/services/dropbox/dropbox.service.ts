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
import { DropboxUtils } from '@utils/dropbox.utils';
import { convertBase64ToBlob } from '@utils/utils';
import { CloudStorageService } from '@models/cloud-storage.model';

@Injectable({
    providedIn: 'root'
})
export class DropboxService implements CloudStorageService {

    dbxAuth: DropboxAuth;

    constructor() {
        this.dbxAuth = new DropboxAuth({
            clientId: environment.DROPBOX.CLIENT_ID,
        });
    }

    // Get authentication url as following
    // `https://www.dropbox.com/oauth2/authorize?client_id=${environment.DROPBOX.CLIENT_ID}&response_type=code&code_challenge=${this.codeChallenge}&code_challenge_method=S256&redirect_uri=http://localhost:8100`;
    async doAuth() {
        console.log('DropboxService::doAuth method called');
        try {
            const authUrl = await this.dbxAuth.getAuthenticationUrl(environment.DROPBOX.REDIRECT_URI, undefined, 'code', 'offline', undefined, undefined, true);
            console.log('authUrl', authUrl);
            console.log('codeVerifier', this.dbxAuth.getCodeVerifier());
            // window.sessionStorage.clear();
            window.sessionStorage.setItem('codeVerifier', this.dbxAuth.getCodeVerifier());
            window.location.href = authUrl.toString();
        } catch (error) {
            return console.error(error);
        }
    }

    // If the user was just redirected from authenticating, the urls hash will
    // contain the access token.
    hasRedirectedFromAuth() {
        return !!DropboxUtils.getCodeFromUrl();
    }

    async getToken() {
        console.log('DropboxService::getToken method called');
        if (this.hasRedirectedFromAuth()) {
            this.dbxAuth.setCodeVerifier(window.sessionStorage.getItem('codeVerifier'));
            return this.dbxAuth.getAccessTokenFromCode(environment.DROPBOX.REDIRECT_URI, DropboxUtils.getCodeFromUrl())
                .then((response) => {
                    console.log('getAccessTokenFromCode response', response);
                    const tokenData = response.result as IDropboxTokenResonse;
                    this.dbxAuth.setAccessToken(tokenData.access_token);
                })
                .catch((error) => {
                    console.error(error)
                });
        }
    }

    uploadVideoOrAudio(videoInfo: {name: string, file: string, mimeType: string}) {
        console.log('DropboxService::uploadVideoOrAudio method called');
        const dbx = new Dropbox({
            auth: this.dbxAuth
        });
        console.log('uploadVideoOrAudio file as base64', videoInfo.file);
        const blobFile = convertBase64ToBlob(videoInfo.file,videoInfo. mimeType);
        return dbx.filesUpload({contents: blobFile, path: `/${videoInfo.name}.${videoInfo.mimeType.split('/').pop()}`, autorename: false, mute: true });
    }

}
