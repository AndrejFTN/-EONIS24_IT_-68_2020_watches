import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import { Constants } from '../shared/constants';
import {Amount, Watch} from '../shared/models';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WatchService {

  private apiGatewayURL = Constants.API_URL + "/watch/";

  protected getUrl(): string {
    return this.apiGatewayURL;
  }

  constructor(private http: HttpClient) { }

  addNewWatch(watch: FormData) {
    const requestOptions: Object = {
      responseType: 'text'
    };
    return this.http.post<string>(this.apiGatewayURL + 'addWatch', watch, requestOptions);
  }

  addAmount(amount: Amount):Observable<string> {
    return this.http.put<string>(this.apiGatewayURL + 'addAmount', amount);
  }

  getAllWatches(): Observable<Watch[]> {
    return this.http.get<Watch[]>(this.getUrl() + 'getAll');
  }

  getOneWatch(id:any): Observable<Watch> {
    return this.http.get<Watch>(this.getUrl() + 'getOneWatch/' + id);
  }

  deleteWatch(watchId: string) {
    return this.http.delete<boolean>(this.apiGatewayURL + 'deleteWatch/' + watchId);
  }

  filterWatches(color?: string, brand?: string, mechanism?: string, minPrice?: number, maxPrice?: number) {
    let queryParams = new HttpParams();
    if(color) {
      queryParams = queryParams.append('colorFilter', color);
    }
    if (brand) {
      queryParams = queryParams.append('brandFilter', brand);
    }
    if (mechanism) {
      queryParams = queryParams.append('mechanismFilter', mechanism);
    }
    if (minPrice) {
      queryParams = queryParams.append('minPriceFilter', minPrice);
    }
    if (maxPrice) {
      queryParams = queryParams.append('maxPriceFilter', maxPrice);
    }
    return this.http.get<Watch[]>(this.apiGatewayURL + 'filterWatches', {params:queryParams});
  }

}

