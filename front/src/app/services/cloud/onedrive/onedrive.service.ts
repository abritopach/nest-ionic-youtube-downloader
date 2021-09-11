import { Injectable } from '@angular/core';
import { CloudStorageService } from '@models/cloud-storage.model';

@Injectable({
    providedIn: 'root'
})
export class OnedriveService implements CloudStorageService {

    private readonly ONEDRIVE_AUTH_URL = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';

    constructor() { }

    async doAuth() {
        console.log('OnedriveService::doAuth method called');

    }

    async getToken() {
        // TODO: Implement this code.
    }

    uploadVideoOrAudio(videoInfo: {name: string; file: string; mimeType: string}) {
        // TODO: Implement this code.
        return Promise.resolve();
    }
}
