import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Watch} from '../../shared/models';
import {WatchService} from '../../services/watch.service';
import {switchMap} from 'rxjs/operators';
import {CartService} from '../../services/cart.service';
import {LoginService} from '../../services/login.service';
import {ToastrService} from 'ngx-toastr';
import * as _ from 'lodash';

@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.css']
})
export class WatchComponent implements OnInit {

  watch: Watch = new Watch();
  quantity: number = 1;
  available: number = 0;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private watchService: WatchService,
              private cartService: CartService,
              private loginService: LoginService,
              private toastService: ToastrService) {
  }

  ngOnInit(): void {
    // redirect to home page if watch Id is not set
    this.route.params.pipe(
      switchMap(params => this.watchService.getOneWatch(params.id))
    ).subscribe(data => {
      this.watch = data;
    });
  }

  addItemToCart(itemID: string | undefined, amount: number) {
    if (!_.isNil(this.watch) && !_.isNil(this.watch.available)) {
      if (this.watch.available < amount) {
        this.toastService.error("Amount is higher that number of available watches!");
        return;
      }
    }
    if(!this.loginService.isUserLoggedIn()) {
      let watchUrl = 'watch/' + itemID;
      this.router.navigate(['/login'], { queryParams: { returnUrl: watchUrl }});
    } else {
      this.cartService.addToCart({itemID, amount}).subscribe(
        data => {
          if (data) {
            this.toastService.info("Successfully added item to shopping cart");
          } else {
            this.toastService.error("Some problem happened, try again later!");
          }
        })
    }
  }
}
