import { Component, OnInit } from '@angular/core';
import { forkJoin, observable } from 'rxjs';
import { user, UserStatic } from "../../shared/Model"
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public user: user = new user;
  public userStore: user = new user;
  isLoading = false;
  constructor(private loginserv: LoginService, private route: Router, private toast: NgToastService) { }

  public _temp: any[] = [];

 
  ngOnInit(): void {

  }

  onSignIn() {
    if (this.user.username != '' && this.user.password != '') {
      this.isLoading = true;
      this.loginserv.LoginCheck(this.user).subscribe(ack => {
        if (ack) {

          this.getUserDetail();
          //this.toast.success({ detail: "Success", summary: 'Logged In', duration: 3000 });
          //this.route.navigate(['/prlist']);
        }
        else {
          this.toast.error({ detail: "Error", summary: 'Enter valid username and password ', duration: 3000 });
          this.isLoading = false;
        }
      });
    }
    else {
      this.toast.error({ detail: "Error", summary: 'Fields cannot be empty', duration: 3000 });
      this.isLoading = false;
    }
  }

  getUserDetail() {

    this.loginserv.getUserDetails().subscribe((udata: any) => {
      if (udata != undefined) {
        sessionStorage.setItem('1', udata.UserId);
        sessionStorage.setItem('2', udata.Username);
        sessionStorage.setItem('3', udata.Role);
        sessionStorage.setItem('4', udata.Designation);
        sessionStorage.setItem('5', 'VerySecretToken');

        this.toast.success({ detail: "Success", summary: 'Logged In', duration: 3000 });

        this.route.navigate(['/prlist']);
      }
      
    });
    this.isLoading = false;
  }
}
