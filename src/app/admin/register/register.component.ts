import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { CustomValidators } from 'ng2-validation';
import { AuthService } from '../auth.service';

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

  ngOnInit(): void {
    this.history = this.route.snapshot.paramMap.get('history');
  }

}
