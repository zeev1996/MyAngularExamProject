import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, Observable, tap, throwError } from "rxjs";
import { Question } from "src/models/QuestionModel";


@Injectable({ providedIn: "root" })
export class QuestionService {
  constructor(private http: HttpClient) { }


  addQuestion(Question): Observable<Question> {

    return this.http.post<Question>("http://localhost:3000/api/questions", Question)
    .pipe(
      tap(data => console.log('All: ', JSON.stringify(data))),
      catchError(this.HandleError)
    );
  }

  getQuestions():Observable<Question[]>{
    return this.http.get<Question[]>("http://localhost:3000/api/questions").pipe(
      tap(data => console.log('All: ', JSON.stringify(data))),
      catchError(this.HandleError)
    );
  }
  
getQuestionsByQuizId(quizId:string):Observable<Question[]>
{
  return this.http.get<Question[]>("http://localhost:3000/api/questions/byQuizId/"+quizId).pipe(
    tap(data => console.log('All: ', JSON.stringify(data))),
    catchError(this.HandleError)
  );
}
getQuestionsByTopic(topic:string):Observable<Question[]>
{
  return this.http.get<Question[]>("http://localhost:3000/api/questions/byTopic/"+topic).pipe(
    tap(data => console.log('All: ', JSON.stringify(data))),
    catchError(this.HandleError)
  );
}
deleteQuestion(questionId:string) {
  return this.http
    .delete("http://localhost:3000/api/questions/"+ questionId).pipe(
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
      errorMessage = `Server retuirned code : ${err.status}, error message is ${err.message}}`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);

  }

}

