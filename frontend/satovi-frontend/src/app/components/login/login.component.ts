import {Component, OnInit, Renderer2} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {first} from "rxjs/internal/operators/first";
import {LoginService} from '../../services/login.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted?: boolean;
  loading?: boolean;
  errorDescription?: string;
  successMessage?: string;

  // used to redirect user to the original page they requested before login
  private returnUrl?: string;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private renderer: Renderer2,
              private formBuilder: FormBuilder,
              private loginService: LoginService,
              private toastService: ToastrService) {

    // redirect to home if use already logged in
    if (loginService.isUserLoggedIn()) {
      this.router.navigate(['/']);
    }

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.submitted = false;
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get formControls() {
    return this.loginForm!.controls;
  }

  onSubmit() {
    this.submitted = true;

    // check if the provided values are valid
    if (this.loginForm!.invalid) {
      return;
    }

    // reset alerts on submit
    this.errorDescription = '';
    this.successMessage = '';

    // flag disable login button
    this.loading = true;

    this.loginService.login(this.formControls.username.value, this.formControls.password.value)
      .pipe(first())
      .subscribe(
        () => {
          console.log("Logged in successfully");
          this.loginService.checkIfAdmin().pipe(first()).subscribe(() => {
            this.toastService.info("Successfully logged in.");
            this.router.navigate(['/watches']);
          }, (er) => {
            console.log(er);
          });
        },
        () => {
          this.errorDescription = 'Invalid username / password.';
          this.loading = false;
          console.log(this.errorDescription);
        });
  }
}
