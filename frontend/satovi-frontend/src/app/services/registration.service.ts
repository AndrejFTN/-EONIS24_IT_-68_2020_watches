import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserCredentials} from "../shared/models";
import { Constants } from '../shared/constants';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  private apiGatewayURL = Constants.API_URL + "/user/";

  constructor(private http: HttpClient) { }

  registerUser(userCredentials: UserCredentials) {
    console.log('User to register', userCredentials);
    return this.http.post<boolean>(this.apiGatewayURL + 'register', userCredentials);
  }

}
