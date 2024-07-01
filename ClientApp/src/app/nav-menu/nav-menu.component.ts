import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit, AfterViewInit {

  constructor(private route: Router, private toast: NgToastService) { }
  isExpanded = false;

  isActive!: number;

  isAdmin: boolean = false;
  hasAccess: boolean = false;

   logName? = '';
   logJob? = '';
   logRole? = '';

  ngOnInit() {
    if (sessionStorage.getItem('3') != 'developer') {
      this.hasAccess = true;
    }
    if (sessionStorage.getItem('3') == 'admin') {
      this.isAdmin = true;
    }
  }
  ngAfterViewInit() {
    this.logName = sessionStorage.getItem('2')!.toString();
    this.logJob = sessionStorage.getItem('4')!.toString();
    this.logRole = sessionStorage.getItem('3')!.toString();
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  SignOut() {
    sessionStorage.clear();
    localStorage.clear();
    this.toast.success({ detail: "Success", summary: 'Logged out', duration: 3000 });
    this.route.navigate(['/']);
  }
}
