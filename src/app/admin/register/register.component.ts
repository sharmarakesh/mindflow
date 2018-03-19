import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { FirebaseError, User } from 'firebase/app';

import { CustomValidators } from 'ng2-validation';

import { AuthService } from '../auth.service';
import { NotificationService } from '../../core/notification.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  private history: string;
  public registrationForm: FormGroup;
  constructor(
    private authSvc: AuthService,
    private notifySvc: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.registrationForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      name: new FormControl('', [Validators.required, Validators.pattern(/[A-Za-z]+(\s[A-Za-z]+)?$/)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    });
    this.registrationForm.addControl('passwordConfirm', new FormControl('', [Validators.required, CustomValidators.equalTo(this.registrationForm.controls['password'])]));
  }

  public login(): void {
    this.router.navigate(['/login']);
  }

  public register(): void {
    this.notifySvc.showLoading();
    this.authSvc.register(
      this.registrationForm.get('email').value.trim(),
      this.registrationForm.get('name').value.trim(),
      this.registrationForm.get('password').value.trim()
    )
      .then(() => {
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

  ngOnInit(): void {
    this.history = this.route.snapshot.paramMap.get('history');
  }

}
