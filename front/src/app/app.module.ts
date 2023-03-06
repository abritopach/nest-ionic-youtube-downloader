import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TranslocoRootModule } from './transloco/transloco-root.module';
import { Storage } from '@ionic/storage';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule.withServerTransition({ appId: 'serverApp' }),
        IonicModule.forRoot(),
        AppRoutingModule,
        HttpClientModule,
        TranslocoRootModule
    ],
    providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, Storage],
    bootstrap: [AppComponent]
})
export class AppModule {}
