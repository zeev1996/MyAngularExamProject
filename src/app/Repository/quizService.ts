import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Quiz } from "src/models/QuizModel";
import { catchError,  map,  Observable, Subject, tap, throwError } from "rxjs";
import { Router } from "@angular/router";
import { Question } from "src/models/QuestionModel";




@Injectable({ providedIn: "root" })
export class QuizService {
  constructor(private http: HttpClient, private router: Router) { }
  private postsUpdated = new Subject<{Quiz:Quiz[],quizCount:number}>();
  private quiz:Quiz[]=[]

  addQuiz(Quiz): Observable<Quiz> {
    return this.http.post<Quiz>("http://localhost:3000/api/quizzes", Quiz).pipe(
      tap(data => console.log('All: ', JSON.stringify(data))),
      catchError(this.HandleError)
    );
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }
  getQuizzes(quizzesPerPage:number,currentPage:number) {
    const queryParams=`?pagesize=${quizzesPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; quizzes:any, maxQuizzes:number }>("http://localhost:3000/api/quizzes"+queryParams)
      .pipe(
        map(quizData => {
          return {quizzes:quizData.quizzes.map(quiz => {
            return {
              title: quiz.title,
              content: quiz.content,
              id: quiz._id,
              quizTopic:quiz.quizTopic,
              questions:quiz.questions,
              quizCreator:quiz.quizCreator
            };
          }),maxQuizzes:quizData.maxQuizzes};
        })
      )
      .subscribe(transformedQuizzesData => {
        if(transformedQuizzesData.quizzes)
        {
          this.quiz = transformedQuizzesData.quizzes;
          this.postsUpdated.next({Quiz:[...this.quiz],quizCount:transformedQuizzesData.maxQuizzes});
        }

      });
  }

  getMyQuizzes(quizzesPerPage:number,currentPage:number,userId:string) {
    const queryParams=`?pagesize=${quizzesPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; quizzes:any, maxQuizzes:number }>("http://localhost:3000/api/quizzes/myQuizzes/" + userId + queryParams)
      .pipe(
        map(quizData => {
          return {quizzes:quizData.quizzes.map(quiz => {
            return {
              title: quiz.title,
              content: quiz.content,
              id: quiz._id,
              quizTopic:quiz.quizTopic,
              questions:quiz.questions,
              quizCreator:quiz.quizCreator,
              publish:quiz.publish
            };
          }),maxQuizzes:quizData.maxQuizzes};
        })
      )
      .subscribe(transformedQuizzesData => {
        if(transformedQuizzesData.quizzes)
        {
          this.quiz = transformedQuizzesData.quizzes;
          this.postsUpdated.next({Quiz:[...this.quiz],quizCount:transformedQuizzesData.maxQuizzes});

        }

      });
  }
getQuizByTopic(quizzesPerPage:number,currentPage:number,topic:string) {
  const queryParams=`?pagesize=${quizzesPerPage}&page=${currentPage}`;
  this.http
    .get<{ message: string; quizzes:any, maxQuizzes:number }>("http://localhost:3000/api/quizzes/byTopic/" + topic + queryParams)
    .pipe(
      map(quizData => {
        return {quizzes:quizData.quizzes.map(quiz => {
          return {
            title: quiz.title,
            content: quiz.content,
            id: quiz._id,
            quizTopic:quiz.quizTopic,
            questions:quiz.questions,
            quizCreator:quiz.quizCreator,
            publish:quiz.publish
          };
        }),maxQuizzes:quizData.maxQuizzes};
      })
    )
    .subscribe(transformedQuizzesData => {
      if(transformedQuizzesData.quizzes)
      {
        this.quiz = transformedQuizzesData.quizzes;
        this.postsUpdated.next({Quiz:[...this.quiz],quizCount:transformedQuizzesData.maxQuizzes});

      }

    });
}






  deleteQuiz(quizId: string) {
    return this.http
      .delete("http://localhost:3000/api/quizzes/" + quizId)

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

  updateQuiz(id: string, title: string, content: string,quizTopic:string,questions:any[]) {
    let QuizData={id:id,title:title,content:content,quizTopic:quizTopic,questions:questions,QuizCreator:null}
     return this.http
       .put("http://localhost:3000/api/quizzes/" + id, QuizData)

   }
publishQuiz(id: string, title: string, content: string,quizTopic:string,questions:string[],publish:boolean)
{
  let QuizData={id:id,title:title,content:content,quizTopic:quizTopic,questions:questions,QuizCreator:null,publish:publish}
  return this.http
    .put("http://localhost:3000/api/quizzes/" + id, QuizData)
}
   patchQuizToPublish(id: string) {
    let QuizData={id:id,publish:true}
     return this.http
       .patch("http://localhost:3000/api/quizzes/" + id, QuizData)

   }


   getQuiz(id: string):Observable<Quiz>  {
    return this.http.get<Quiz>(
      "http://localhost:3000/api/quizzes/" + id
    );
  }

}
