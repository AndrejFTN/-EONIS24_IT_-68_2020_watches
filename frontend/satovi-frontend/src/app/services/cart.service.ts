import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {CartItem, ShoppingCart, Watch} from "../shared/models";
import { Constants } from '../shared/constants';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiGatewayURL = Constants.API_URL + "/cart/";

  constructor(private http: HttpClient) { }

  addToCart(addItem: CartItem): Observable<boolean> {
    return this.http.post<boolean>(this.apiGatewayURL + 'addToCart', addItem);
  }

  emptyShoppingCart() {
    return this.http.post(this.apiGatewayURL + 'emptyCart', null);
  }

  getShoppingCart(): Observable<ShoppingCart> {
    return this.http.get<ShoppingCart>(this.apiGatewayURL + 'getShoppingCart');
  }

  removeItemFromCart(itemID: string): Observable<boolean> {
    console.log('Deleting item: ' + itemID + ' from cart!');
    return this.http.delete<boolean>(this.apiGatewayURL + 'removeItemFromCart/' + itemID );
  }
}
