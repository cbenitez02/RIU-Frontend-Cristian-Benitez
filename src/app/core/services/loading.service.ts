import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private readonly _isLoading = signal(false);
  private loadingCount = 0;

  readonly isLoading = this._isLoading.asReadonly();

  show(): void {
    this.loadingCount++;
    if (this.loadingCount === 1) {
      this._isLoading.set(true);
    }
  }

  hide(): void {
    this.loadingCount--;
    if (this.loadingCount <= 0) {
      this.loadingCount = 0;
      this._isLoading.set(false);
    }
  }

  forceHide(): void {
    this.loadingCount = 0;
    this._isLoading.set(false);
  }
}
