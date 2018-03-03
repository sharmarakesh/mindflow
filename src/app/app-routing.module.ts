import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GraphComponent } from './graph/graph.component';

const appRoutes: Routes = [
  {
    path: '',
    component: GraphComponent
  }
]

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true }
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }