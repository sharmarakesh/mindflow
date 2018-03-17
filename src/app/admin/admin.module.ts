import { NgModule } from '@angular/core';

import { AdminRoutingModule } from './admin-routing.module';
import { AuthService } from './auth.service';
import { CoreModule } from '../core/core.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  imports: [
    AdminRoutingModule,
    CoreModule
  ],
  declarations: [
    ForgotPasswordComponent,
    LoginComponent,
    RegisterComponent
  ],
  exports: [AdminRoutingModule],
  providers: [AuthService]
})
export class AdminModule { }
