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
    doAuth(): Promise<void>;
    getToken(): Promise<void>;
    uploadVideoOrAudio(videoInfo: {name: string, file: Blob | string, mimeType: string}): Promise<DropboxResponse<files.FileMetadata>> | Promise<any>;
}
