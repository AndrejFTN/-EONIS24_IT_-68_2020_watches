import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import { Constants } from "../shared/constants";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiGatewayURL = Constants.API_URL + "/user/";


  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    console.log('User with username ' + username + ' and password ' + password + ' is trying to login');
    const requestOptions: Object = {
      responseType: 'text'
    };
    return this.http.post<string>(this.apiGatewayURL + 'login', {username, password}, requestOptions)
      .pipe(map(jwt => {
        // store username and jwt token in local storage to keep user logged in between page refreshes
        console.log("User authenticated!");
        let token = 'Bearer ' + jwt;
        localStorage.setItem('username', username);
        localStorage.setItem('token', token);
      }));
  }

  checkIfAdmin() {
    return this.http.get<boolean>(this.apiGatewayURL + 'checkIfAdmin').pipe(map((isAdmin) => {
      if (isAdmin) {
        localStorage.setItem('admin', "true");
      } else {
        localStorage.setItem('admin', "false");
      }
    }));
  }

  logout() {
    // remove username and token from local storage
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
  }

  isUserLoggedIn() {
    let user = localStorage.getItem('username');
    let token = localStorage.getItem('token');
    return !(user === null || token === null);
  }

  isUserAdmin() {
    let admin = localStorage.getItem('admin');
    return admin != null && admin === 'true';
  }
}

