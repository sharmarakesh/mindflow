import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';

import { Flow } from '../../flow/models';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnChanges {
  @Input() fixedInViewport: boolean;
  @Input() flows: Flow[];
  @Input() mode: string;
  @Input() open: boolean;
  @Output() add: EventEmitter<void> = new EventEmitter<void>();
  @Output() edit: EventEmitter<Flow> = new EventEmitter<Flow>();
  @Output() remove: EventEmitter<Flow> = new EventEmitter<Flow>();
  @Output() select: EventEmitter<Flow> = new EventEmitter<Flow>();
  @ViewChild('sideNav') sideNav: MatSidenav;

  public addFlow(): void {
    this.add.emit();
  }

  public editFlow(flow: Flow): void {
    this.edit.emit(flow);
  }

  public removeFlow(flow: Flow): void {
    this.remove.emit(flow);
  }

  public selectFlow(flow: Flow): void {
    this.select.emit(flow);
  }

  ngOnChanges(changes: { fixedInViewport, mode, open }): void {
    if ('open' in changes) {
      this.sideNav.toggle(changes.open.currentValue);
    }
  }

}
