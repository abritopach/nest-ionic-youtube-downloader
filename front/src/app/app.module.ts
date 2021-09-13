import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TranslocoRootModule } from './transloco/transloco-root.module';
import { Storage } from '@ionic/storage';

// Azure.
import { MsalModule } from '@azure/msal-angular';
import { PublicClientApplication } from '@azure/msal-browser';
import { environment } from '@environments/environment';

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    TranslocoRootModule,
    MsalModule.forRoot( new PublicClientApplication({
      auth: {
        clientId: environment.onedrive.clientId,
        authority: environment.onedrive.authority,
        redirectUri: environment.onedrive.redirectUri
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: isIE, // Set to true for Internet Explorer 11
      }
    }), null, null)
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, Storage],
  bootstrap: [AppComponent],
})
export class AppModule {}
