import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Order, UserInfo} from "../shared/models";
import { Constants } from '../shared/constants';
import {Observable} from 'rxjs';
import {PaymentModel} from '../components/stripe-payement/payment-form.component';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiGatewayURL = Constants.API_URL + "/order/";
  private payURL = Constants.API_URL + "/payment";

  constructor(private http: HttpClient) { }

  makeOrder(userInfo: UserInfo) {
    const requestOptions: Object = {
      responseType: 'text'
    };
    return this.http.post<string>(this.apiGatewayURL + 'makeOrder', userInfo, requestOptions);
  }

  completeOrder(orderID: string): Observable<boolean> {
    return this.http.post<boolean>(this.apiGatewayURL + 'completeOrder', orderID);
  }

  getOrder(orderId: string): Observable<Order> {
    return this.http.post<Order>(this.apiGatewayURL + 'getOrder',  orderId );
  }

  getPendingOrders(): Observable<Order[]> {
    console.log("get pending orders");
    return this.http.get<Order[]>(this.apiGatewayURL + 'getAllPendingOrders');
  }

  getAllPendingOrdersForUser(username: string): Observable<Order[]> {
    console.log("get pending orders");
    return this.http.get<Order[]>(this.apiGatewayURL + 'getAllPendingOrdersForUser/' + username);
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiGatewayURL + 'getAllOrders');
  }

  payOrder(payment: PaymentModel): Observable<any> {
    return this.http.post<any>(this.payURL + '/createPayment', payment);
  }
}
