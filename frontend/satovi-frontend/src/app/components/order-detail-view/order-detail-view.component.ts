import { Component, OnInit } from '@angular/core';
import {switchMap} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {Order} from '../../shared/models';
import {OrderService} from '../../services/order.service';

@Component({
  selector: 'app-order-detail-view',
  templateUrl: './order-detail-view.component.html',
  styleUrls: ['./order-detail-view.component.css']
})
export class OrderDetailViewComponent implements OnInit {
  order: Order = new Order();
  orderId: string = "";

  constructor(private route: ActivatedRoute,
              private orderService: OrderService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.orderId = params.id;
    });
    this.orderService.getOrder(this.orderId).subscribe(order => {
      this.order = order;
    });
  }

}
