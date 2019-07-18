import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class RestApiService {
  url: string;
  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }
  
  private extractData(res: Response) {
    let body = res;
    console.log('@@@ Response: '+JSON.stringify(body));
    return body || { };
  }

  // ------------------------------------ my coding starts from here ----------------------------------
  // get user by userid
  getuserbyuserid(userid): Observable<any>{
    return this.http.get(baseUrl+'getuserbyuserid/'+userid, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  // student registration
  registernewstudent(data): Observable<any>{
    return this.http.post(baseUrl+'registernewstudent', data, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  // student list of a specific teacher
  getallstudentsbyteacher(_userid):Observable<any>{
    this.url = baseUrl+'getallstudentsbyteacher/'+_userid;
    this.show(this.url);
    return this.http.get(this.url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }
  // get baselinetest
  getbaselinetestquestionset(data):Observable<any>{
    this.url = baseUrl+'getbaselinetestquestionset';
    this.show(this.url);
    return this.http.post(this.url, data, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }
  // setlevel
  setlevelbyid(data): Observable<any>{
    return this.http.post(baseUrl+'setlevelbyid', data, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }
  // update level
  updatelevelbyid(id,data): Observable<any>{
    return this.http.put(baseUrl+'updatelevelbyid/'+id, data, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }
  // get all student list by teacher id
  getallstudentsbyteacherid(userid):Observable<any>{
    this.url = baseUrl+'getallstudentsbyteacherid/'+userid;
    this.show(this.url);
    return this.http.get(this.url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  // get attendance by teacher id and date
  getattendanceofteacherbydate(userid, attendancedate):Observable<any>{
    this.url = baseUrl+'getattendanceofteacherbydate/'+userid+'/'+attendancedate;
    this.show(this.url);
    return this.http.get(this.url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  // save attendance
  saveattendance(data): Observable<any>{
    return this.http.post(baseUrl+'saveattendance', data, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  // view payment records
  getalltchpaymentdetailsbystudentid(studentid):Observable<any>{
    this.url = baseUrl+'getalltchpaymentdetailsbystudentid/'+studentid;
    this.show(this.url);
    return this.http.get(this.url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  // make payment
  savetchpaymentdetails(data): Observable<any>{
    return this.http.post(baseUrl+'savetchpaymentdetails', data, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  // get tch assessment
  gettchassessment(program, clas, stage, subject):Observable<any>{
    this.url = baseUrl+'gettchassessment/'+program+'/'+clas+'/'+stage+'/'+subject;
    this.show(this.url);
    return this.http.get(this.url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  // get tch assessmenttest
  gettchassessmenttest(studentid, program, clas, stage, subject):Observable<any>{
    this.url = baseUrl+'gettchassessmenttest/'+studentid+'/'+program+'/'+clas+'/'+stage+'/'+subject;
    this.show(this.url);
    return this.http.get(this.url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  // save assessment test for each student
  createtchassessmenttest(data): Observable<any>{
    return this.http.post(baseUrl+'createtchassessmenttest', data, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  // get distinct activities
  getmasteractivities(program, subject, month, week): Observable<any>{
    return this.http.get(baseUrl+'getmasteractivities/'+program+'/'+subject+'/'+month+'/'+week, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  // get activity details
  getmasteractivitiydetails(program, subject, month, week, activity): Observable<any>{
    return this.http.get(baseUrl+'getmasteractivitiydetails/'+program+'/'+subject+'/'+month+'/'+week+'/'+activity, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  // get activity by userid
  gettchactivitiydetails(userid, program, subject, month, week, activity): Observable<any>{
    return this.http.get(baseUrl+'gettchactivitiydetails/'+userid+'/'+program+'/'+subject+'/'+month+'/'+week+'/'+activity, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  // save tch activity
  savetchactivity(data): Observable<any>{
    return this.http.post(baseUrl+'savetchactivity', data, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }







  // authenticate user
  authenticateuser(data): Observable<any>{
    return this.http.post(baseUrl+'authenticateuser', data, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  // getcurrentdate
  getcurrentdate():Observable<any>{
    this.url = baseUrl+'getcurrentdate';
    return this.http.get(this.url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  // getallcentersallocatedbyuserid
  getallcentersallocatedbyuserid(_userid):Observable<any>{
    this.url = baseUrl+'getallcentersallocatedbyuserid/'+_userid;
    this.show(this.url);
    return this.http.get(this.url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  // getcenter feedback
  getallcenterfeedback():Observable<any>{
    this.url = baseUrl+'getallcenterfeedback';
    return this.http.get(this.url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  
  // savedailyinfo
  savedailyinfo(data): Observable<any>{
    return this.http.post(baseUrl+'savedailyinfo', data, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  // savecenterimage
  savecenterimage(data): Observable<any>{
    return this.http.post(baseUrl+'savecenterimage', data, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  // savegeolocation
  savegeolocation(data): Observable<any>{
    return this.http.post(baseUrl+'savegeolocation', data, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  // save manager center feedback
  createcenterfeedbackmgr(data): Observable<any>{
    return this.http.post(baseUrl+'createcenterfeedbackmgr', data, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  // get all paymentinfo
  getallpaymentinfo():Observable<any>{
    this.url = baseUrl+'getallpaymentinfo';
    return this.http.get(this.url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  // save manager paymentinfo
  createpaymentinfomgr(data): Observable<any>{
    return this.http.post(baseUrl+'createpaymentinfomgr', data, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  // get all assessment
  getallassessment():Observable<any>{
    this.url = baseUrl+'getallassessment';
    return this.http.get(this.url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  // save manager assessment
  createassessmentmgr(data): Observable<any>{
    return this.http.post(baseUrl+'createassessmentmgr', data, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  // get all community
  getallcommunityvisit():Observable<any>{
    this.url = baseUrl+'getallcommunityvisit';
    return this.http.get(this.url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  // save manager community
  createcommunitymgr(data): Observable<any>{
    return this.http.post(baseUrl+'createcommunitymgr', data, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  // get all issue
  getallissues():Observable<any>{
    this.url = baseUrl+'getallissues';
    return this.http.get(this.url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  // save manager issue
  createissuesmgr(data): Observable<any>{
    return this.http.post(baseUrl+'createissuesmgr', data, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  // save daily expenses
  savedailyexpense(data): Observable<any>{
    return this.http.post(baseUrl+'savedailyexpense', data, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  // get messages by userid
  getmessagesbyuserid(userid):Observable<any>{
      this.url = baseUrl+'getmessagesbyuserid/'+userid;
      return this.http.get(this.url, httpOptions).pipe(
          map(this.extractData),
          catchError(this.handleError));
  }

  // update message status by id
  updatemessagebyid(id, data):Observable<any>{
    this.url = baseUrl+'updatemessagebyid/'+id;
      return this.http.put(this.url, data, httpOptions).pipe(
          map(this.extractData),
          catchError(this.handleError));
  }
  //-------------------------------------------------------------------------











  getClassroom(): Observable<any> {
    return this.http.get(baseUrl, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }
  
  getClassroomById(id: string): Observable<any> {
    const url = `${baseUrl}/${id}`;
    return this.http.get(url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }
  
  postClassroom(data): Observable<any> {
    const url = `${baseUrl}/add_with_students`;
    return this.http.post(url, data, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  updateClassroom(id: string, data): Observable<any> {
    const url = `${baseUrl}/${id}`;
    return this.http.put(url, data, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  deleteClassroom(id: string): Observable<{}> {
    const url = `${baseUrl}/${id}`;
    return this.http.delete(url, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  show(url: string){
    console.log('@@@ url: '+url);
  }
}
