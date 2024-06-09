import { Component, OnInit } from '@angular/core';
import {Order, OrderedWatch} from '../../shared/models';
import { OrderService } from '../../services/order.service';
import {StripeService} from '../stripe-payement/stripe-payement.component';
import * as _ from 'lodash';
import {BehaviorSubject} from 'rxjs';
import {LoginService} from '../../services/login.service';

@Component({
  selector: 'app-pending-orders',
  templateUrl: './pending-orders.component.html',
  styleUrls: ['./pending-orders.component.css']
})
export class PendingOrdersComponent implements OnInit {
  pendingOrders: Order[] = [];
  paymentFormVisibleForOrder: string | null = null;
  amount: number = 0;
  public isAdmin = new BehaviorSubject<boolean>(false);


  constructor(private orderService: OrderService,
              private loginService: LoginService) { }

  ngOnInit(): void {
    this.loadPendingOrders();
    this.isAdmin.next(this.loginService.isUserAdmin());
  }

  loadPendingOrders() {
    this.orderService.getPendingOrders().subscribe(data => {
      this.pendingOrders = data;
    });
  }

  completeOrder(orderID: string) {
    this.orderService.completeOrder(orderID).subscribe(
      (res) => {
        if (res) {
          this.loadPendingOrders();
        }
      }, (e) => {
        console.log(e);
      });
  }

  showPaymentForm(orderID: string, items: OrderedWatch[]) {
    this.paymentFormVisibleForOrder = orderID;
    items.forEach(item =>{
      if (!_.isNil(item.amount) && !_.isNil(item.price)){
        this.amount += item.amount * item.price;
      }
    })
  }

  handlePaymentCompleted() {
    this.loadPendingOrders();
    this.paymentFormVisibleForOrder = "";
  }
}
