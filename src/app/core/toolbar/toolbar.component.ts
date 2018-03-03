import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {
  @Output() sideNavToggle: EventEmitter<void> = new EventEmitter<void>();

  public toggleSideNav(): void {
    this.sideNavToggle.emit();
  }
}
