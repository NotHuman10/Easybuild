import { Injectable, OnDestroy } from '@angular/core';

@Injectable()
export class StateService implements OnDestroy {
  private state: Map<string, any> = new Map<string, any>();

  get<T>(key: string): T {
    return this.state.get(key) as T;
  }

  set<T>(key: string, value: T): void {
    this.state.set(key, value);
  }

  remove(key: string): void {
    this.state.delete(key);
  }

  clear(): void {
    this.state.clear();
  }

  ngOnDestroy(): void {
    this.state.clear();
  }
}