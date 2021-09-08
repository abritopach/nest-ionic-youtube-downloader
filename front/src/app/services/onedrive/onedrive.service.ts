import { Injectable } from '@angular/core';
import { CloudStorageService } from '@models/cloud-storage.model';

@Injectable({
    providedIn: 'root'
})
export class OnedriveService implements CloudStorageService {

    constructor() { }

    async doAuth() {
        // TODO: Implement this code.
    }

    async getToken() {
        // TODO: Implement this code.
    }

    uploadVideoOrAudio(videoInfo: {name: string; file: string; mimeType: string}) {
        // TODO: Implement this code.
        return Promise.resolve();
    }
}
