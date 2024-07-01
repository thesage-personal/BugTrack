export class user {
  public userid: number = 0 ;
  public username: string = '';
  public password: string = '';
  public designation: string = '';
  public role: string = '';
  public roleid: number = 0;
}
export class ProblemReport {
  public prid: number = 0; 
  public  prnumber: string = ''; 
  public  description: string = ''; 
  public  status: string = 'New'; 
  public originator: string = '';
  public dateoriginated: Date = new Date;
  public datecompleted: Date = new Date; 
  public  priority: string = ''; 
  public prfixer: string = ''; 
  public printroducer: string = ''; 
  public project: string = ''; 
  public ddescription: string = '';
  public etafixing: Date = new Date;
  public prfile: string = '';
}
export class Projects {
  public projectid: number = 0;
  public project: string = '';
}
export class Comments {
  public commentid?: number;
  public prid: number = 0;
  public originator: string = '';
  //public originatorid: number = 0;
  public receiver: string = '';
 /* public receiverid: number = 0;*/
  public status: string = '';
  public statement: string = '';
  public commenton: Date = new Date();
}
export class UserStatic {
  public static userId: number = 0;
  public static username: string = '';
  public static password: string = '';
  public static designation: string = '';
  public static role: string = '';
  public static roleId: number = 0;
}
