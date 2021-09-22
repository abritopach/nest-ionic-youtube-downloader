export interface AuthOneDrive {
    token_type: "Bearer";
    scope: string;
    expires_in: number;
    ext_expires_in: number;
    access_token: string;
    refresh_token: string;
}

export interface UploadSessionOneDrive {
    '@odata.context': string;
    expirationDateTime: Date;
    nextExpectedRanges: string[];
    uploadUrl: string;
}
