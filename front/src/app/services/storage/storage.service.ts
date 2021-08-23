import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage) {
    this.init();
  }

  private async init() {
    await this.storage.create();
  }

  public async set(key: string, value: string) {
    return await this.storage.set(key, value);
  }

  public async get(key: string) {
    return await this.storage.get(key);
  }

  public async remove(key: string) {
    return await this.storage.remove(key);
  }
}
