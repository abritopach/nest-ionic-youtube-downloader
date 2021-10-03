import { Observable } from 'rxjs';
import { DropboxResponse, files } from 'dropbox';
import { AuthOneDrive, UploadFileResultOneDrive } from './onedrive.model';

/**
 * Description [Interface to define cloud storage service.]
 *
 * @author abrito
 * @version 0.0.1
 *
 * @interface
 */

export interface CloudStorageService {
    doAuth(): Promise<void> | Promise<gapi.auth2.GoogleAuth>;
    getToken(): Promise<void> | Promise<string> | Promise<AuthOneDrive>;
    uploadVideoOrAudio(videoInfo: {name: string; file: Blob | string; mimeType: string}):
    Promise<DropboxResponse<files.FileMetadata>> | Promise<any> | Observable<UploadFileResultOneDrive>;
}
