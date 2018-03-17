import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FlowComponent } from './flow/flow.component';

const appRoutes: Routes = [
  {
    path: 'flow',
    component: FlowComponent
  },
  {
    path: '',
    redirectTo: '/register',
    pathMatch: 'full'
  }
]

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false }
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }