import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError,  map,  Observable, Subject, tap, throwError } from "rxjs";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class TopicService {
  constructor(private http: HttpClient, private router: Router) { }

  addTopic(topic:string): Observable<any> {
     const Topic={name:topic}
    return this.http.post<any>("http://localhost:3000/api/topics", Topic)
    .pipe(
      tap(data => console.log('All: ', JSON.stringify(data))),
      catchError(this.HandleError)
    );
  }
  getTopics():Observable<any>{
    return this.http.get<any>("http://localhost:3000/api/topics").pipe(
      tap(data => console.log('All: ', JSON.stringify(data))),
      catchError(this.HandleError)
    );
  }





  private HandleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    }
    else {
      errorMessage = `Server returned code : ${err.status}, error message is ${err.message}}`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);

  }
}
