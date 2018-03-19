import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { FirebaseError, User } from 'firebase/app';

import { AuthService } from '../auth.service';
import { NotificationService } from '../../core/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private history: string;
  public loginForm: FormGroup;
  constructor(
    private authSvc: AuthService,
    private notifySvc: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    });
  }

  public forgotPassword(): void {
    this.router.navigate(['/password-reset']);
  }

  public login(): void {
    this.notifySvc.showLoading();
    this.authSvc.login(
      this.loginForm.get('email').value.trim(),
      this.loginForm.get('password').value.trim()
    )
      .then((user: User) => {
        this.notifySvc.closeLoading();
        if (this.history) {
          this.router.navigate([this.history]);
        } else {
          this.router.navigate(['/flow']);
        }
      }).catch((err: FirebaseError) => {
        this.notifySvc.closeLoading();
        this.notifySvc.showError(err.message);
      });
  }

  public register(): void {
    this.router.navigate(['/register']);
  }

  ngOnInit(): void {
    this.history = this.route.snapshot.paramMap.get('history');
  }

}
