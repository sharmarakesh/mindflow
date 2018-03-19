import { NgModule } from '@angular/core';

import { AdminRoutingModule } from './admin-routing.module';
import { AuthService } from './auth.service';
import { CoreModule } from '../core/core.module';
import { LoginComponent } from './login/login.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  imports: [
    AdminRoutingModule,
    CoreModule
  ],
  declarations: [
    LoginComponent,
    PasswordResetComponent,
    RegisterComponent
  ],
  exports: [AdminRoutingModule],
  providers: [AuthService]
})
export class AdminModule { }
