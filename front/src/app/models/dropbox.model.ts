
/**
 * Description [Interface to define dropbox token response data.]
 *
 * @author abrito
 * @version 0.0.1
 */

export interface DropboxTokenResonse {
    /* eslint-disable @typescript-eslint/naming-convention */
    access_token: string;
    account_id: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    token_type: 'bearer';
    uid: string;
}
