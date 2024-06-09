import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {Router} from "@angular/router";
import {LoginService} from "../../services/login.service";
import {BehaviorSubject} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Request, Watch} from '../../shared/models';
import {first} from 'rxjs/operators';
import {RequestService} from '../../services/request.service';
import {ToastrService} from 'ngx-toastr';
import {WatchService} from '../../services/watch.service';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css']
})
export class MenubarComponent implements OnInit{

  items: MenuItem[] = [];
  public isLoggedIn$ = new BehaviorSubject<boolean>(true);
  public isAdmin$ = new BehaviorSubject<boolean>(false);
  requestDialog$ = new BehaviorSubject<boolean>(false);
  addWatchDialog$ = new BehaviorSubject<boolean>(false);
  addWatchForm: FormGroup;
  requestForm: FormGroup;
  submitted?: boolean;
  addWatchSubmitted?: boolean;
  loading?: boolean;
  addWatchLoading?: boolean;
  watches: any[] = [];

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private toastService: ToastrService,
              private requestService: RequestService,
              private watchService: WatchService,
              private loginService: LoginService,
              private cd: ChangeDetectorRef) {
    this.requestForm = this.formBuilder.group({
      subject: ['', Validators.required],
      email: ['', Validators.required],
      text: ['', Validators.required],
      name: ['', Validators.required],
    });
    this.addWatchForm = this.formBuilder.group({
      model: ['', Validators.required],
      color: ['', Validators.required],
      brand: ['', Validators.required],
      manufactureDate: ['', Validators.required],
      mechanism: ['', Validators.required],
      price: ['', Validators.required],
      available: ['', Validators.required],
      image: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.isLoggedIn$.next(this.loginService.isUserLoggedIn());
    this.isAdmin$.next(this.loginService.isUserAdmin());
    this.items = [
      {
        label: 'Watches',
        icon: 'pi pi-clock',
        routerLink: '/watches',
      },
      {
        label: 'Orders',
        icon: 'pi pi-briefcase',
        routerLink: '/order',
      },
      {
        label: 'Cart',
        icon: 'pi pi-shopping-cart',
        routerLink: '/cart'
      }
    ]
  }

  get formControls() {
    return this.requestForm!.controls;
  }
  get addWatchFormControls() {
    return this.addWatchForm!.controls;
  }

  logout() {
    this.loginService.logout();
    this.isLoggedIn$.next(this.loginService.isUserLoggedIn());
    this.isAdmin$.next(this.loginService.isUserAdmin());
    this.router.navigate(["/login"]);
  }
  login() {
    this.router.navigate(["/login"]);
  }

  openAddWatchDialog() {
    this.addWatchDialog$.next(true);
    this.addWatchSubmitted = false;
    this.addWatchLoading = false;
  }

  openRequestDialog() {
    this.requestDialog$.next(true);
    this.submitted = false;
    this.loading = false;
  }

  closeRequestDialog() {
    this.requestDialog$.next(false);
    this.submitted = false;
    this.loading = false;
  }

  closeAddWatchDialog() {
    this.addWatchDialog$.next(false);
    this.addWatchSubmitted = false;
    this.addWatchLoading = false;
  }

  onSubmit() {
    this.submitted = true;

    // check if the provided values are valid
    if (this.requestForm!.invalid) {
      return;
    }

    // flag disable button
    this.loading = true;

    const request: Request ={
      subject: this.formControls.subject.value,
      email: this.formControls.email.value,
      text: this.formControls.text.value,
      name: this.formControls.name.value,
    }
    this.requestService.sendRequest(request)
      .pipe(first())
      .subscribe(
        (msg) => {
          console.log(msg);
          this.toastService.info("You have successfully sent a request!");
          this.closeRequestDialog();
        },
        (err) => {
          console.error(err);
          this.loading = false;
        }
      )
  }

  submitAddWatch() {
    this.addWatchSubmitted = true;

    // check if the provided values are valid
    if (this.addWatchForm!.invalid) {
      return;
    }

    // flag disable button
    this.addWatchLoading = true;

    const formData: FormData = new FormData();
    formData.append('model', this.addWatchFormControls.model.value);
    formData.append('color', this.addWatchFormControls.color.value);
    formData.append('brand', this.addWatchFormControls.brand.value);
    formData.append('manufactureDate', this.addWatchFormControls.manufactureDate.value);
    formData.append('mechanism', this.addWatchFormControls.mechanism.value);
    formData.append('price', this.addWatchFormControls.price.value);
    formData.append('available', this.addWatchFormControls.available.value);

    if (this.addWatchFormControls.image.value) {
      formData.append('image', this.addWatchFormControls.image.value);
    }

    this.watchService.addNewWatch(formData)
      .pipe(first())
      .subscribe(
        (msg) => {
          console.log(msg);
          this.toastService.info("You have successfully add new watch!");
          this.closeAddWatchDialog();
        },
        (err) => {
          console.error(err);
          this.addWatchLoading = false;
        }
      )
  }

  onFileChange(event: any, field: string) {
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      if (!file.type.startsWith('image')) {
        this.addWatchForm.get(field)!.setErrors({
          required: true
        });
        this.cd.markForCheck();
      } else {
        this.addWatchForm.patchValue({
          [field]: file
        });
        this.cd.markForCheck();
      }
    }
  }

}
