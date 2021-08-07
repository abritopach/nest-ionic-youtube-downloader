import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

declare var gapi: any;

@Injectable({
    providedIn: 'root'
})
export class GapiAuthService {

    constructor() { }

    initGapiAuth(): Promise<any> {
        return new Promise((resolve, reject) => {
            gapi.load('auth2', async () => {
                const gAuth = await gapi.auth2.init({
                    apiKey: environment.GAPI.API_KEY,
                    client_id: environment.GAPI.CLIENT_ID,
                    discoveryDocs: environment.GAPI.DISCOVERY_DOCS,
                    scope: environment.GAPI.SCOPE
                });
                resolve(gAuth);
            }, reject);
        });
    }

    fetchGoogleUser(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const gAuth = await this.initGapiAuth();
                const oAuthUser = await gAuth.signIn({prompt: 'consent'});
                console.log('user basic profile', oAuthUser.getBasicProfile());
                //const authResponse = gAuth.currentUser.get().getAuthResponse();
                //console.log('authResponse', authResponse);
                resolve(oAuthUser);
            } catch (e) {
                reject(e);
            }
        });
    }

}
