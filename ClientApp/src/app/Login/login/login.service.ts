import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { user, UserStatic } from '../../shared/Model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  httpOptions = { headers: ({ 'Content-Type': 'application/json' }) };
  constructor(private http: HttpClient, @Inject('BASE_URL') private baseurl: string, public route: Router) { }

  

  LoginCheck(user: user) {
    return this.http.post(this.baseurl + 'login/check', JSON.stringify(user), this.httpOptions);
  }
  getUserDetails() {
    return this.http.get<UserStatic>(this.baseurl + 'login/userdetails');
  }
}
