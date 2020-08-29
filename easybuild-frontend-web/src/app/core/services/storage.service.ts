import { Injectable } from '@angular/core';

@Injectable()
export class PermanentStorageService {
  get<T>(key: string) {
    let resultJSON = localStorage.getItem(key);
    return JSON.parse(resultJSON) as T;
  }

  set<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}