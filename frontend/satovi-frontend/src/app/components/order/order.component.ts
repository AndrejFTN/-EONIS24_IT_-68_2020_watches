import {Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Order, OrderedWatch} from '../../shared/models';
import {OrderService} from '../../services/order.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  @Input()
  orderID: string = "";

  @Input()
  amount: number = 0;

  orders: Order[] = [];
  paymentFormVisibleForOrder: string | null = null;
  username: string = "";
  constructor(private orderService: OrderService) { }


  ngOnInit(): void {
    this.loadPendingOrders();
  }

  loadPendingOrders() {
    let username = localStorage.getItem('username');
    this.orderService.getAllPendingOrdersForUser(username!).subscribe(data => {
      this.orders = data;
    });
  }

  handlePaymentCompleted() {
    this.loadPendingOrders();
    this.paymentFormVisibleForOrder = "";
  }

  showPaymentForm(orderID: string, items: OrderedWatch[]) {
    this.paymentFormVisibleForOrder = orderID;
    items.forEach(item =>{
      if (!_.isNil(item.amount) && !_.isNil(item.price)){
        this.amount += item.amount * item.price;
      }
    })
  }
}
