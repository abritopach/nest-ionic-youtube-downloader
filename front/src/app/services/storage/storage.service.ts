import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage) {
    this.init();
  }

  public async set(key: string, value: string) {
    return this.storage.set(key, value);
  }

  public async get(key: string) {
    return this.storage.get(key);
  }

  public async remove(key: string) {
    return this.storage.remove(key);
  }

  private async init() {
    await this.storage.create();
  }

}
