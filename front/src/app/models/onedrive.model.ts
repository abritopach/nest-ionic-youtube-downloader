export interface AuthOneDrive {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    token_type: 'Bearer';
    scope: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    expires_in: number;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ext_expires_in: number;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    access_token: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    refresh_token: string;
}

export interface UploadSessionOneDrive {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '@odata.context': string;
    expirationDateTime: Date;
    nextExpectedRanges: string[];
    uploadUrl: string;
}


interface Application {
    id: string;
}

interface User {
    id: string;
}

interface CreatedBy {
    application: Application;
    user: User;
}

interface LastModifiedBy {
    application: Application;
    user: User;
}
interface ParentReference {
    driveId: string;
    driveType: string;
    id: string;
    path: string;
}
interface Hashes {
    quickXorHash: string;
    sha1Hash: string;
    sha256Hash: string;
}
interface File {
    hashes: Hashes;
    mimeType: string;
    processingMetadata: boolean;
}

interface FileSystemInfo {
    createdDateTime: Date;
    lastModifiedDateTime: Date;
}

interface Reactions {
    commentCount: number;
}

export interface UploadFileResultOneDrive  {
    createdBy: CreatedBy;
    createdDateTime: Date;
    cTag: string;
    eTag: string;
    id: string;
    lastModifiedBy: LastModifiedBy;
    lastModifiedDateTime: Date;
    name: string;
    parentReference: ParentReference;
    size: number;
    webUrl: string;
    items: [];
    file: File;
    fileSystemInfo: FileSystemInfo;
    reactions: Reactions;
    tags: [];
    lenses: [];
}
