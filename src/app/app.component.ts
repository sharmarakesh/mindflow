import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnDestroy {
  public mobileQuery: MediaQueryList;
  public sideNavFixed: boolean;
  public sideNavMode: string;
  public sideNavOpen: boolean;
  private mobileQueryListener: () => void;
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher
  ) {
    this.mobileQueryListener = () => {
      this.setSideNav();
      this.changeDetectorRef.detectChanges();
    };
    this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
    this.setSideNav();
    this.mobileQuery.addListener(this.mobileQueryListener);
  }

  public onSideNavToggle(): void {
    this.sideNavOpen = !this.sideNavOpen;
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

  private setSideNav(): void {
    this.sideNavFixed = this.mobileQuery.matches;
    this.sideNavOpen = !this.mobileQuery.matches;
    this.sideNavMode = this.mobileQuery.matches ? 'over' : 'side';
  }
}
