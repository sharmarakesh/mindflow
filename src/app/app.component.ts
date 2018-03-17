import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';

import 'rxjs/add/operator/filter';

import { NotificationService } from './core/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnDestroy, OnInit {
  public mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;
  private navUrl: string = '';
  public sideNavFixed: boolean;
  public sideNavMode: string;
  public sideNavOpen: boolean;
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private notifyPvd: NotificationService,
    private router: Router
  ) {
    this.mobileQueryListener = () => {
      this.setSideNav();
      this.changeDetectorRef.detectChanges();
    };
    this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
    this.setSideNav();
    this.mobileQuery.addListener(this.mobileQueryListener);
  }

  public get isAdmin(): boolean {
    return !this.navUrl.includes('flow')
  }

  public onSideNavToggle(): void {
    this.sideNavOpen = !this.sideNavOpen;
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

  ngOnInit(): void {
    this.router.events.filter(e => e instanceof RouterEvent)
      .subscribe((e: RouterEvent) => {
        this.navUrl = e.url;
      }, (err: any) => {
        console.error(err);
      });
  }

  private setSideNav(): void {
    this.sideNavFixed = this.mobileQuery.matches;
    this.sideNavMode = this.mobileQuery.matches ? 'over' : 'side';
    this.sideNavOpen = !this.mobileQuery.matches;
  }
}
