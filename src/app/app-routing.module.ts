import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './core/auth-guard.service';
import { FlowComponent } from './flow/flow.component';

const appRoutes: Routes = [
  {
    path: 'flow',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: FlowComponent
      }
    ]
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