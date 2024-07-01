import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authserv: AuthService, private route: Router, private toast: NgToastService) { }
  canActivate()
    //route: ActivatedRouteSnapshot,
  //state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
  {
    if (this.authserv.isLoggedIn()) {
      return true;
    }
    else {
      this.toast.error({ detail: "Error!", summary: 'You are not Logged in.', duration: 3000 });
      this.route.navigate(['']);
      return false;
    }
    
  }
  
}
