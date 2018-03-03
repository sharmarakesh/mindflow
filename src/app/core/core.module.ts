import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  MatSidenavModule,
  MatToolbarModule
} from '@angular/material';

import { ToolbarComponent } from './toolbar/toolbar.component';

@NgModule({
  declarations: [
    ToolbarComponent
  ],
  exports: [
    CommonModule,
    ToolbarComponent
  ],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule
  ],
  providers: []
})
export class CoreModule{}