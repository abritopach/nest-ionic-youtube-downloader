import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VideoDownloaderWorkerService {

  constructor() { }

  // https://medium.com/swlh/angular-and-web-workers-17cd3bf9acca
  async createWorker(blob: Blob, fileName: string) {
    if (typeof Worker !== 'undefined') {
      // Create a new
      const worker = new Worker(new URL('../app.worker', import.meta.url));
      worker.onmessage = ({ data }) => {
          console.log(`page got message: ${data}`);
      };
      worker.postMessage({blob, fileName});
  } else {
      // Web Workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
  }
  }
}
