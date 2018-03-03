import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnChanges {
  @Input() fixedInViewport: boolean;
  @Input() mode: string;
  @Input() open: boolean;
  @ViewChild('sideNav') sideNav: MatSidenav;

  ngOnChanges(changes: { fixedInViewport, mode, open }): void {
    if ('open' in changes) {
      this.sideNav.toggle(changes.open.currentValue);
    }
  }

}
