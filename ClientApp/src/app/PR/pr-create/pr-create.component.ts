
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ProblemReport, Projects, user } from '../../shared/Model';
import { CommonServiceService } from '../Services/common-service.service';

@Component({
  selector: 'app-pr-create',
  templateUrl: './pr-create.component.html',
  styleUrls: ['./pr-create.component.css']
})
export class PrCreateComponent implements OnInit {

  constructor(private commserv: CommonServiceService, private toast: NgToastService, private formBuilder: FormBuilder, private route: Router) { }
  public rand?: string;
  public projectObj: Projects[] = [];
  public userObj: user[] = [];
  public prObj: ProblemReport = new ProblemReport;
  public prcreate!: FormGroup ;

  public priority: string[] = ['Critical','Moderate'];

  public devObj: any[] = [];
  

  ngOnInit(): void {
    this.genPRN();
    this.onLoad();
    this.validation();
  }

  onLoad() {
    //get project list
    this.commserv.getListProjects().subscribe(prj => {
      this.projectObj = prj;
      this.prObj.originator = sessionStorage.getItem('2')!.toString();
    });
    //get developers list
    this.commserv.getListDevelopers().subscribe(devd => {
      this.devObj = devd;
    });
  }
  genPRN() {
    return (this.prObj.prnumber = 'PR' + (Math.floor(Math.random() * 9999)));
  }

  onSubmit() {
    
    this.commserv.setPr(this.prObj).subscribe(ack => {
      if (ack) {
        this.toast.success({ detail: "Success", summary: 'PR Created', duration: 3000 });
        this.route.navigate(['/prlist']);
      }
      else {
        this.toast.error({ detail: "Error", summary: 'Failed to create PR', duration: 3000 });
      }
    });
  }
  //upload file
  handleUpload(element: any) {
    var tempvar;
    var file = element.target.files[0];
    this.commserv.upload(file).subscribe((ack) => {
      if (ack) {
        this.toast.success({ detail: "Success!", summary: 'File Uploaded Successfully', duration: 3000 });
      }
      else {
        this.toast.error({ detail: "Error!", summary: 'File Upload Unsuccessful', duration: 3000 });
      }
    });
  }
  validation() {
    this.prcreate = new FormGroup({
      desc: new FormControl(null,Validators.required),
      prior: new FormControl(null, Validators.required),
      fixer: new FormControl(null, Validators.required),
      introducer: new FormControl(null, Validators.required),
      proj: new FormControl(null, Validators.required),
      ddesc: new FormControl(null, Validators.required),
      
    });
  }
}



 
