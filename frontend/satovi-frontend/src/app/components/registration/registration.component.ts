import {Component, OnInit, Renderer2} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/internal/operators/first';
import {RegistrationService} from '../../services/registration.service';
import {LoginService} from '../../services/login.service';
import {UserCredentials} from '../../shared/models';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  registerForm: FormGroup;
  submitted?: boolean;
  loading?: boolean;
  errorDescription?: string;
  successMessage?: string;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private renderer: Renderer2,
              private formBuilder: FormBuilder,
              private loginService: LoginService,
              private registrationService: RegistrationService,
              private toastService: ToastrService) {

    // redirect to home if use already logged in
    if (loginService.isUserLoggedIn()) {
      this.router.navigate(['/']);
    }

    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.submitted = false;
  }

  get formControls() {
    return this.registerForm!.controls;
  }

  onSubmit() {
    this.submitted = true;

    // check if the provided values are valid
    if (this.registerForm!.invalid) {
      return;
    }

    // reset alerts on submit
    this.errorDescription = '';
    this.successMessage = '';

    // flag disable register button
    this.loading = true;

    const userCredentials: UserCredentials = {
      username: this.formControls.username.value,
      password: this.formControls.password.value
    };

    this.registrationService.registerUser(userCredentials)
      .subscribe(data => {
        if (data) {
          console.log("Registered successfully");
          this.toastService.info("Successfully registered.");
          this.router.navigate(["/login"]);
        } else {
          this.errorDescription = 'Something went wrong with registration.';
          this.loading = false;
          console.log(this.errorDescription);
        }
      })
  }
}
