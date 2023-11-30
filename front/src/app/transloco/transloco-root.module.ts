import { HttpClient } from '@angular/common/http';
import {
  Translation,
  TranslocoLoader,
  TranslocoModule,
  provideTransloco
} from '@ngneat/transloco';
import { Injectable, NgModule } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string) {
    return this.http.get<Translation>(`/assets/i18n/${lang}.json`);
  }
}

@NgModule({
  exports: [ TranslocoModule ],
  providers: [
      provideTransloco({
          config: {
              availableLangs: ['en', 'es'],
              defaultLang: 'en',
              // Remove this option if your application doesn't support changing language in runtime.
              reRenderOnLangChange: true,
              prodMode: environment.production,
          },
          loader: TranslocoHttpLoader
      }),
  ],
})
export class TranslocoRootModule {}

