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

if (typeof Worker !== 'undefined') {
  // Create a new
  const worker = new Worker(new URL('./app.worker', import.meta.url));
  worker.onmessage = ({ data }) => {
    console.log(`page got message: ${data}`);
  };
  worker.postMessage('hello');
} else {
  // Web Workers are not supported in this environment.
  // You should add a fallback so that your program still executes correctly.
}