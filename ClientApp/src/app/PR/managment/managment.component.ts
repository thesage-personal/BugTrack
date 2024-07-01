import { Component, OnInit } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { User } from 'oidc-client';
import { Projects, user } from '../../shared/Model';
import { CommonServiceService } from '../Services/common-service.service';

@Component({
  selector: 'app-managment',
  templateUrl: './managment.component.html',
  styleUrls: ['./managment.component.css']
})
export class ManagmentComponent implements OnInit {

  constructor(private commserv: CommonServiceService, private toast: NgToastService) { }
  public projectObj: Projects[] = [];
  public setProject = new Projects;
  public updateProject = new Projects;
  public delProject = new Projects;
  public userObj: user[] = [];
  public setUser = new user;
  public updateUser = new user;
 public deleteUsr = new user;

  public roleArr: string[] = ['admin', 'tester','developer'];
  public desigArr: string[] = ['ASW','Super','Quality Analyst','GET','LST'];
  ngOnInit(): void {
  }

  wantUser() {
    this.commserv.getUserList().subscribe(ul => {
      this.userObj = ul;
    });
  }

  wantProjects() {
    this.commserv.getListProjects().subscribe(prj => {
      this.projectObj = prj;
    });
  }

  setProJect(sp: Projects) {
    this.commserv.setProject(sp).subscribe(ack => {
      if (ack) {
        this.toast.success({ detail: "Success", summary: 'Project Added', duration: 3000 });
        this.wantProjects();
      }
      else {
        this.toast.error({ detail: "Error", summary: 'Failed to add project', duration: 3000 });
      }
    });
  }

  setUsr(su: user) {
    this.commserv.setUser(su).subscribe(ack => {
      if (ack) {
        this.toast.success({ detail: "Success", summary: 'User Added', duration: 3000 });
        this.wantUser();
      }
      else {
        this.toast.error({ detail: "Error", summary: 'Failed to add user', duration: 3000 });
      }
    });
  }
  updateUsr(upu: user) {
    this.commserv.updateUser(upu).subscribe(ack => {
      if (ack) {
        this.toast.success({ detail: "Success", summary: 'User updated', duration: 3000 });
        this.wantUser();
      }
      else {
        this.toast.error({ detail: "Error", summary: 'Failed to update user', duration: 3000 });
      }
    });
  }
  updatePrj(p: Projects) {
    this.commserv.updateProject(p).subscribe(ack => {
      if (ack) {
        this.toast.success({ detail: "Success", summary: 'Project updated', duration: 3000 });
        this.wantProjects();
      }
      else {
        this.toast.error({ detail: "Error", summary: 'Failed to update project', duration: 3000 });
      }
    });
  }
  filterUserbyId(id: number) {
    const result = this.userObj.find(ul => ul.userid == id);
    result != undefined ? this.updateUser = result : console.log("no data");
  }
  filterProjectbyId(id: number) {
    const result = this.projectObj.find(pl => pl.projectid == id);
    result != undefined ? this.updateProject = result : console.log("no data");
  }
  deleteUser(id: number) {
    this.deleteUsr.userid = id;
    this.commserv.deleteUser(this.deleteUsr).subscribe(ack => {
      if (ack) {
        this.toast.success({ detail: "Success", summary: 'User deleted', duration: 3000 });
        this.wantUser();
      }
      else {
        this.toast.error({ detail: "Error", summary: 'Failed to delete user', duration: 3000 });
      }
    });
  }
  deleteProject(id: number) {
    this.delProject.projectid = id;
    this.commserv.deleteProject(this.delProject).subscribe(ack => {
      if (ack) {
        this.toast.success({ detail: "Success", summary: 'Project deleted', duration: 3000 });

        this.wantProjects();
      }
      else {
        this.toast.error({ detail: "Error", summary: 'Failed to delete project', duration: 3000 });
      }
    });
  }
}
