import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { FirebaseError, User } from 'firebase/app';

import { AuthService } from '../auth.service';
import { NotificationService } from '../../core/notification.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {
  private history: string;
  public passwordResetForm: FormGroup;
  constructor(
    private authSvc: AuthService,
    private notifySvc: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.passwordResetForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  public login(): void {
    this.router.navigate(['/login']);
  }

  public reqestReset(): void {
    this.notifySvc.showLoading();
    this.authSvc.reqestReset(
      this.passwordResetForm.get('email').value.trim()
    )
      .then(() => {
        this.notifySvc.closeLoading();
        this.notifySvc.showNotificationDialog('An email with a password reset link has been sent. Go to your email inbox, follow the instructions, and change the password of your account.', 'Request sent')
          .afterClosed().toPromise().then(() => {
            this.router.navigate(['/login']);
          })
          .catch((err: any) => this.notifySvc.showError(err))
      }).catch((err: FirebaseError) => {
        this.notifySvc.closeLoading();
        this.notifySvc.showError(err.message);
      });
  }

  ngOnInit(): void {
    this.history = this.route.snapshot.paramMap.get('history');
  }

}
