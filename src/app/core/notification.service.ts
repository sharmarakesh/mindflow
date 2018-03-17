import { Injectable } from '@angular/core';

@Injectable()
export class NotificationService {

  constructor() { }

  public closeLoading(): void {
  }

  public showError(message: string): void {
  }

  public showInfo(message: string, duration?: number): void {
  }

  public showLoading(): void {
  }

}
