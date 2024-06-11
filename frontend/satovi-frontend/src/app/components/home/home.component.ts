import {Component, OnInit} from '@angular/core';
import {WatchService} from '../../services/watch.service';
import {Amount, Watch} from '../../shared/models';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {LoginService} from '../../services/login.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  watches: Watch[] = [];
  addAmount = new BehaviorSubject<boolean>(false);
  addAmountForm: FormGroup;
  addAmountSubmitted?: boolean;
  loading?: boolean;
  public isAdmin = new BehaviorSubject<boolean>(false);

  searchBrand?: string;
  searchColor?: string;
  searchMechanism?: string;
  searchMinPrice?: number;
  searchMaxPrice?: number;

  constructor(private watchService: WatchService,
              private router: Router,
              private loginService: LoginService,
              private formBuilder: FormBuilder,
              private toastService: ToastrService,) {

    this.addAmountForm = this.formBuilder.group({
      amount: ['', Validators.required],
      watch_id: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.isAdmin.next(this.loginService.isUserAdmin());
    this.getWatchs();
  }

  getWatchs() {
    this.watchService.getAllWatches().subscribe(async data => {
      for (let i = 0; i < data.length; i++) {
        const watch = data[i];
        if (watch.image) {
          watch.imageUrl = 'data:image/jpeg;base64,' + watch.image;
        }
      }
      this.watches = data;
    });
  }

  openWatch(id:any) {
    this.router.navigate(['/watch/' + id]);
  }

  deleteWatch(id:any) {
    this.watchService.deleteWatch(id);
  }

  get addAmountFormControls() {
    return this.addAmountForm!.controls;
  }

  openAddAmountDialog(id:string) {
    this.addAmount.next(true);
    this.addAmountForm.patchValue({
      watch_id: id
    });
    this.addAmountSubmitted = false;
    this.loading = false;
  }

  closeAddAmountDialog() {
    this.addAmount.next(false);
    this.addAmountSubmitted = false;
    this.loading = false;
  }

  async submitAddAmount() {
    this.addAmountSubmitted = true;

    const newAmount: Amount = {
      amount: this.addAmountFormControls.amount.value,
      watchId: this.addAmountFormControls.watch_id.value
    };

    if (this.addAmountForm.invalid) {
      return;
    }

    this.loading = true;

    try {
      await this.watchService.addAmount(newAmount).toPromise();
      this.closeAddAmountDialog();
      this.toastService.info("You have successfully added a new amount!");
      this.getWatchs();
    } catch (error) {
      this.toastService.info("You have successfully added a new amount!");
      this.getWatchs();
    } finally {
      this.loading = false;
    }
  }

  searchWatches() {
    this.watchService.filterWatches(
      this.searchColor,
      this.searchBrand,
      this.searchMechanism,
      this.searchMinPrice,
      this.searchMaxPrice
    ).subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        const watch = data[i];
        if (watch.image) {
          watch.imageUrl = 'data:image/jpeg;base64,' + watch.image;
        }
      }
      this.watches = data;
    });
  }
}
