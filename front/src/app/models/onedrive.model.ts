interface IdTokenClaims {
    ver: string;
    iss: string;
    sub: string;
    aud: string;
    exp: number;
    iat: number;
    nbf: number;
    name: string;
    preferred_username: string;
    oid: string;
    tid: string;
    nonce: string;
    aio: string;
}

interface Account {
    homeAccountId: string;
    environment: string;
    tenantId: string;
    username: string;
    localAccountId: string;
    name: string;
    idTokenClaims: IdTokenClaims;
}

export interface AuthOneDrive {
    authority: string;
    uniqueId: string;
    tenantId: string;
    scopes: string[];
    account: Account;
    idToken: string;
    idTokenClaims: IdTokenClaims;
    accessToken: string;
    fromCache: boolean;
    expiresOn: Date;
    correlationId: string;
    extExpiresOn: Date;
    familyId: string;
    tokenType: string;
    state: string;
    cloudGraphHostName: string;
    msGraphHost: string;
}