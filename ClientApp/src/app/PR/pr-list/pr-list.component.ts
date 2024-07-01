import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { observable } from 'rxjs';
import { ProblemReport, user } from '../../shared/Model';
import { CommonServiceService } from '../Services/common-service.service';

@Component({
  selector: 'app-pr-list',
  templateUrl: './pr-list.component.html',
  styleUrls: ['./pr-list.component.css']
})
export class PrListComponent implements OnInit {

  constructor(private commserv: CommonServiceService, private route: Router, private toast: NgToastService) { }
  public user: user[] = [];
  public prList: ProblemReport[] = [];
  public prListOpen: ProblemReport[] = [];
  public prListInProgress: ProblemReport[] = [];
  public prListVerification: ProblemReport[] = [];
  public prListClose: ProblemReport[] = [];

  public stateArr: string[] = ['New', 'Problem Fixing', 'Verification','Closed'];
  public page: number = 1;
  public searchInput: string = 'New';
  public count: number = 0;
  public hasAccess = false;
  ngOnInit(): void {
    this.onLoad();
   
  }
  onLoad() {
    this.commserv.getListPr().subscribe(x => {
      this.prList = x;
      if (this.prList.length != 0) {
        this.filterPrsbyUser();
        //this.filterPrs();
      }
      else {
        alert("no data");
      }
    })
  }
  filterPrsbyUser() {
    if (sessionStorage.getItem('3') != 'admin') {
      if (sessionStorage.getItem('3') == 'tester') {
        this.hasAccess = true;
        this.prList = this.prList.filter(ufl => ufl.originator == sessionStorage.getItem('2'))
      }
      else if (sessionStorage.getItem('3') == 'developer') {
        this.prList = this.prList.filter(ufl => ufl.printroducer == sessionStorage.getItem('2'))
      }
    }
    else {
      this.hasAccess = true;
    }
  }

  filterPrs() {
    this.prListOpen = this.prList.filter(ofl => ofl.status == 'New');
    this.prListInProgress =  this.prList.filter(ofl => ofl.status == 'Problem Fixing');
    this.prListVerification =  this.prList.filter(ofl => ofl.status == 'Verification');
    this.prListClose =  this.prList.filter(ofl => ofl.status == 'Closed');
  }
  onView(id: number) {
    this.commserv.staticId(id); //working
    this.route.navigate(['/prview']), {
      queryParams: { id: JSON.stringify(id) }
    }
  }

  wantDelete(id: number) {
    var tempPrObj = new ProblemReport;
    tempPrObj.prid = id;
    this.commserv.deletePR(tempPrObj).subscribe(ack => {
      if (ack) {
        this.toast.success({ detail: "Success", summary: 'PR delete', duration: 3000 });
        this.onLoad(); //not working
      }
      else {
        this.toast.error({ detail: "Error", summary: 'Failed to delete PR', duration: 3000 });
      }
    });
    
  }
}
