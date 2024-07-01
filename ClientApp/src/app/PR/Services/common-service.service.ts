import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Comments, ProblemReport, Projects, user } from '../../shared/Model';

@Injectable({
  providedIn: 'root'
})
export class CommonServiceService {
  
  constructor(private http: HttpClient, private route: Router, @Inject('BASE_URL') private baseurl: string) { }
  
  httpOptions = { headers: ({ 'Content-Type': 'application/json' }) };
  public static id: number;

 
  staticId(id: number) {
    CommonServiceService.id = id;
  }
  getListPr() {
    return this.http.get<ProblemReport[]>(this.baseurl + 'pr/get');
  }
  getListComments() {
    return this.http.get<Comments[]>(this.baseurl + 'pr/get/comments')
  }
  getListProjects() {
    return this.http.get<Projects[]>(this.baseurl + 'pr/get/projects');
  }
  getListDevelopers() {
    return this.http.get<any[]>(this.baseurl + 'pr/get/developers');
  }
 
  getUserDetails() {
    return this.http.get<unknown[]>(this.baseurl + 'login/userdetails');
  }

  getUserList() {
    return this.http.get<user[]>(this.baseurl + 'pr/get/users');
  }

  setUser(u: user) {
    return this.http.post(this.baseurl + 'login/set/user', JSON.stringify(u), this.httpOptions)
  }

  setPr(pr: ProblemReport) {
    return this.http.post(this.baseurl + 'pr/set', JSON.stringify(pr), this.httpOptions);
  }

  setProject(p: Projects) {
    return this.http.post(this.baseurl + 'pr/set/project', JSON.stringify(p), this.httpOptions)
  }
  setComment(comm: Comments) {
    return this.http.post(this.baseurl + 'pr/set/comment', JSON.stringify(comm), this.httpOptions)
  }

  updateUser(u: user) {
    return this.http.post(this.baseurl + 'login/update/user', JSON.stringify(u), this.httpOptions)
  }
  updateProject(p: Projects) {
    return this.http.post(this.baseurl + 'pr/update/project', JSON.stringify(p), this.httpOptions)
  }
  updatePR(pr: ProblemReport) {
    return this.http.post(this.baseurl + 'pr/update', JSON.stringify(pr), this.httpOptions)
  }

  deletePR(pr: ProblemReport) {
    return this.http.post(this.baseurl + 'pr/delete', JSON.stringify(pr), this.httpOptions)
  }
  deleteUser(u: user) {
    return this.http.post(this.baseurl + 'login/delete/user', JSON.stringify(u), this.httpOptions)
  }

  deleteProject(p: Projects) {
    return this.http.post(this.baseurl + 'pr/delete/project', JSON.stringify(p), this.httpOptions)
  }

  upload(file: File) {
    const formData: FormData = new FormData();

    formData.append('file', file, file.name);
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data');

    const req = new HttpRequest('POST', `${this.baseurl + 'pr/set/file'}`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    var temp = this.http.request(req);
    return temp;

    //return this.http.post(this.baseurl + 'pr/set/file', formData, { headers });
  }
  retrieveFile(n: number) {
    return this.http.post(this.baseurl + 'pr/get/file', JSON.stringify(n), this.httpOptions);
  }

  deleteFile(id: number) {
    return this.http.post(this.baseurl + 'pr/delete/file', JSON.stringify(id), this.httpOptions);
  }
  
}
