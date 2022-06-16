import { Component } from '@angular/core';
import { getBrowserLang, TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private translocoService: TranslocoService) {
    let currentLanguage = getBrowserLang();
    const availableLangs = this.translocoService.getAvailableLangs() as string[];
    if (!availableLangs.includes(currentLanguage)) {
      currentLanguage = 'en';
  }
    this.translocoService.setActiveLang(currentLanguage);
  }
}
