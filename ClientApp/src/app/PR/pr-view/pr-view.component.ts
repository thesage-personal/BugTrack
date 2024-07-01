import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { Comments, ProblemReport, Projects } from '../../shared/Model';
import { CommonServiceService } from '../Services/common-service.service';

@Component({
  selector: 'app-pr-view',
  templateUrl: './pr-view.component.html',
  styleUrls: ['./pr-view.component.css']
})
export class PrViewComponent implements OnInit {

  constructor(private aroute: ActivatedRoute, private commserv: CommonServiceService, private toast: NgToastService, private route: Router) {
  }
  public id: unknown;
  public prList: ProblemReport[] = [];
  public prListById: ProblemReport = new ProblemReport;
  public prUpdate: ProblemReport = new ProblemReport;
  public projectList: Projects[] = [];
  public devList: any[] = [];
  public comArr: Comments[] = [];
  public comByPr: Comments[] = [];
  public com = new Comments;


  public state: string[] = ['New', 'Problem Fixing', 'Verification', 'Closed'];
  public impact: string[] = ['Critical', 'Moderate'];
  public d: number = Date.parse("9999-12-31");
  public filePath: string = '';

  public sF1: boolean = false;
  public sF2: boolean = false;
  public sF3: boolean = false;
  public sF4: boolean = false;
  public sF5: boolean = false;

  public hasEditAccess: boolean = false;
  public hasFile: boolean = false;

  ngOnInit(): void {
    this.onLoad();
  }

  onLoad() {
    //this.aroute.queryParams.subscribe(id => {
    //  this.id = id;
    //  console.log(id);//not working
    //});

    this.commserv.getListPr().subscribe(prl => {
      this.prList = prl;
      if (this.prList.length != 0) {
        this.filterByPrId();
        
      }
      else {
        alert("no Data")
      }
    });
    this.commserv.getListDevelopers().subscribe(devl => {
      this.devList = devl;
    });
    this.commserv.getListProjects().subscribe(prjl => {
      this.projectList = prjl;
    });
    this.commserv.getListComments().subscribe(coms => {
      this.comArr = coms;
      if (this.comArr.length != 0) {
        this.filterComment();
      }
    });
    this.retrieveFile();
  }

  filterByPrId() {
    const result = this.prList.find(p => p.prid == CommonServiceService.id);
    if (result != undefined) {
      this.prUpdate = this.prListById = result;
    }
    else {
      alert("error");
    }
    //this.prListById.datecompleted.getFullYear() == 9999 ? this.prListById.datecompleted.setUTCDate(0) : '';
    this.showStatus();

    if (sessionStorage.getItem('3') != 'developer') {
      this.hasEditAccess = true;
    }
  }
  filterComment() {
    const result = this.comArr.filter(c => c.prid == CommonServiceService.id);
    if (result.length != 0) {
      this.comByPr = result
     
    }
    else {
      //console.log("comments for prid " + CommonServiceService.id + " does not exist");
      //this.toast.info({ detail: "Information", summary: 'No comments for prid ' + CommonServiceService.id , duration: 3000 });
    }
  }
  showStatus() {
    if (this.prListById.status == 'New') {
      this.sF1 = true;
    }
    else if (this.prListById.status == 'Problem Fixing') {
      this.sF1 = true;
      this.sF2 = true;
    }
    else if (this.prListById.status == 'Verification') {
      this.sF1 = true;
      this.sF2 = true;
      this.sF3 = true;
    }
    if (this.prListById.status == 'Closed') {
      this.sF1 = true;
      this.sF2 = true;
      this.sF3 = true;
      this.sF4 = true;
    }
  }

  onUpdate(like: ProblemReport) {
    //like.datecompleted == null ? Date.UTC(0, 0) : like.datecompleted;
    //like.etafixing == null ? Date.UTC(0, 0) : like.etafixing;
    this.commserv.updatePR(like).subscribe(ack => {
      if (ack) {
        this.toast.success({ detail: "Success", summary: 'PR updated', duration: 3000 });
        this.onLoad(); //test
      }
      else {
        this.toast.error({ detail: "Error", summary: 'Failed to update PR', duration: 3000 });
      }
    });
  }

  onComment(comm: Comments) {
    comm.prid = CommonServiceService.id;
    comm.originator = sessionStorage.getItem('2')!.toString();
    if (sessionStorage.getItem('3') != 'tester') {
      comm.receiver = this.prListById.originator;
    }
    else {
      comm.receiver = this.prListById.prfixer;
    }
    this.commserv.setComment(comm).subscribe(ack => {
      if (ack) {
        this.toast.success({ detail: "Success", summary: 'Comment Created', duration: 3000 });
        this.onLoad();
      }
      else {
        this.toast.error({ detail: "Error", summary: 'Failed to create comment', duration: 3000 });
      }
    });
  }

  retrieveFile() {
    //var path = require('path'); //not working
    var prid = CommonServiceService.id;
    this.commserv.retrieveFile(prid).subscribe((fpath: any) => {
      if (fpath != null) {
        this.filePath = fpath[0].prfilepath;
      }
      if (this.filePath != undefined) {
        //this.filePath = path.parse(this.filePath).base //not working
        //this.filePath = this.filePath?.split('\\').pop().split('/').pop(); //working in quick watch but not running
        this.filePath = this.filePath?.split('\\')[7];

        this.hasFile = true;
      }
    });
  }
  onDownloadFile(s: string) {
    //var URL = "https://localhost:44459/" + s;
    //window.open(s);
    window.open('../../../assets/files/' + s);

  }

  handleUpload(f: any) {
    var file = f.target.files[0];
    if (this.hasFile) {
      this.deleteFile();
      this.uploadFile(file); //upload new file
    }
    else {
      this.uploadFile(file);
    }
  }

  uploadFile(f: any) {
    this.commserv.upload(f).subscribe(ack => {
      if (ack) {
        this.toast.success({ detail: "Success", summary: 'File Uploaded Successfully', duration: 3000 });
      }
      else {
        this.toast.error({ detail: "Error", summary: 'File upload unsuccessfully', duration: 3000 });

      }

    });
  }
  deleteFile() {
     var id = CommonServiceService.id;
    this.commserv.deleteFile(id).subscribe(ack => {
      if (ack) {
        this.toast.success({ detail: "Success", summary: 'File Deleted Successfully', duration: 3000 });
        
      }
      else {
        this.toast.error({ detail: "Error", summary: 'File upload unsuccessfully', duration: 3000 });

      }
    });
  }
}
