import {Injectable} from '@angular/core';
import {Constants} from '../shared/constants';
import {HttpClient} from '@angular/common/http';
import {Request} from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private apiGatewayURL = Constants.API_URL + "/request/";

  constructor(private http: HttpClient) { }

  sendRequest(request: Request) {
    const requestOptions: Object = {
      responseType: 'text'
    };
    return this.http.post<string>(this.apiGatewayURL + 'sendRequest', request, requestOptions);
  }
}
