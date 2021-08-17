/**
 * Description [Interface to define cloud storage service.]
 *
 * @author abrito
 * @version 0.0.1
 *
 * @interface
 */

import { DropboxResponse, files } from "dropbox";
import { Observable } from "rxjs";

export interface CloudStorageService {
    doAuth(): Promise<void> | Promise<gapi.auth2.GoogleAuth>;
    getToken(): Promise<void> | Promise<string>;
    uploadVideoOrAudio(videoInfo: {name: string, file: Blob | string, mimeType: string}): Promise<DropboxResponse<files.FileMetadata>> | Promise<any>;
}
