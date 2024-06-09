import { Component, OnInit } from '@angular/core';
import {BehaviorSubject, forkJoin, Observable, of} from 'rxjs';
import {CartItem, ShoppingCart, UserInfo, Watch} from '../../shared/models';
import {CartService} from '../../services/cart.service';
import {first, mergeMap, map} from 'rxjs/operators';
import {WatchService} from '../../services/watch.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {OrderService} from '../../services/order.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  shoppingCart: ShoppingCart = new ShoppingCart();
  orderDialog$ = new BehaviorSubject<boolean>(false);
  orderForm: FormGroup;
  submitted?: boolean;
  loading?: boolean;
  fullPrice: number = 0;

  constructor(private cartService: CartService,
              private orderService: OrderService,
              private formBuilder: FormBuilder,
              private watchService: WatchService) {
    this.orderForm = this.formBuilder.group({
      name: ['', Validators.required],
      mail: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      zipCode: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.submitted = false;
    this.loadCombinedShoppingCart();
    this.orderDialog$.next(false);
  }


  get formControls() {
    return this.orderForm!.controls;
  }

  emptyCart() {
    this.cartService.emptyShoppingCart().pipe(first()).subscribe(
      () => {
        this.loadCombinedShoppingCart();
      }, (e) => {
        console.log(e);
      });
  }

  removeItemFromCart(itemID: string) {
    this.cartService.removeItemFromCart(itemID).subscribe(
      () => {
        this.loadCombinedShoppingCart();
      }, (e) => {
        console.log(e);
      });
  }

  loadCombinedShoppingCart(): void {
    this.cartService.getShoppingCart().pipe(
      mergeMap((result: ShoppingCart) => {
        let watchRequests = result.cartItems.map(cartItem => this.watchService.getOneWatch(cartItem.watchID!));

        // Provera da li postoji bar sat u zahtjevu
        if (watchRequests.length > 0) {
          return forkJoin(watchRequests).pipe(
            map((watchArray: Watch[]) => {
              result.cartItems.forEach((eachItem, index) => {
                eachItem.watch = watchArray[index];
              });
              return result;
            })
          );
        } else {
          return of(result);
        }
      })
    ).subscribe(
      (data: ShoppingCart) => {
        this.shoppingCart = data;
        this.calculateFullPrice();
      },
      (error) => {
        console.error('Error loading combined shopping cart', error);
      }
    );
  }

  calculateFullPrice(): void {
    this.fullPrice = 0; // Resetujemo cijenu na početnu vrijednost
    this.shoppingCart.cartItems.forEach(item => {
      if (!_.isNil(item.watch) && !_.isNil(item.watch?.price) && !_.isNil(item.amount)) {
        this.fullPrice += item.watch?.price * item.amount;
      }
    });
  }


  openOrderDialog() {
    this.orderDialog$.next(true);
    this.submitted = false;
    this.loading = false;
  }

  closeOrderDialog() {
    this.orderDialog$.next(false);
    this.loading = false;
    this.submitted = false;
  }

  onSubmit() {
    this.submitted = true;

    // check if the provided values are valid
    if (this.orderForm!.invalid) {
      return;
    }

    // flag disable button
    this.loading = true;

    const userInfo: UserInfo ={
      name: this.formControls.name.value,
      mail: this.formControls.mail.value,
      phone: this.formControls.phone.value,
      address: this.formControls.address.value,
      zipCode: this.formControls.zipCode.value
    }
    this.orderService.makeOrder(userInfo)
      .pipe(first())
      .subscribe(
        (msg) => {
          console.log(msg);
          this.loadCombinedShoppingCart();
          this.orderDialog$.next(false);
          this.emptyCart();
        },
        (err) => {
          console.error(err);
          this.loading = false;
        }
      )
  }
}
