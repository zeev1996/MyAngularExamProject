import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/Repository/auth.service';
import { QuizService } from 'src/app/Repository/quizService';
import { TopicService } from 'src/app/Repository/topicService';
import { Quiz } from 'src/models/QuizModel';

@Component({
  selector: 'app-my-quizzes',
  templateUrl: './my-quizzes.component.html',
  styleUrls: ['./my-quizzes.component.css'],
})
export class MyQuizzesComponent implements OnInit, OnDestroy {
  quizzes: Quiz[] = [];
  userId: string;
  isChecked = true;
  authStatusSub: Subscription;
  private _ListFilter: string = '';
  get listFilter(): string {
    return this._ListFilter;
  }
  set listFilter(value: string) {
    this._ListFilter = value;
    if (this.listFilter === '') {
      this.filteredQuizes = this.quizzes;
    } else {
      this.filteredQuizes = this.preformFilter(value);
    }
  }

  filteredQuizes: Quiz[] = [];
  isLoading = false;
  totalposts: number = 0;
  PostsPerPage: number = 5;
  currentPage = 1;
  userIsAuthenticated: boolean = false;
  pageSizeOptions = [5, 15, 25];
  private Sub: Subscription;
  mapParam: string;
  constructor(
    private quizService: QuizService,
    private _snackBar: MatSnackBar,
    private authservice: AuthService
  ) {}
  displayedColumns: string[] = [
    'title',
    'quizTopic',
    'content',
    'edit',
    'publish',
    'questions',
  ];
  dataSource = new MatTableDataSource(this.filteredQuizes);

  preformFilter(filterBy: string): Quiz[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.quizzes.filter((quiz: Quiz) =>
      quiz.title.toLocaleLowerCase().includes(filterBy)
    );
  }

  ngOnInit() {
    this.isLoading = true;
    this.userId = this.authservice.getUserId();
    this.quizService.getMyQuizzes(this.PostsPerPage, 1, this.userId);
    this.Sub = this.quizService
      .getPostUpdateListener()
      .subscribe((quizData: { Quiz: Quiz[]; quizCount: number }) => {
        this.isLoading = false;
        this.totalposts = quizData.quizCount;
        this.quizzes = quizData.Quiz;
        this.filteredQuizes = this.quizzes;
      });

    this.userIsAuthenticated = this.authservice.getIsAuth();
    this.authStatusSub = this.authservice
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userId = this.authservice.getUserId();
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'ok');
  }

  onClick(content) {
    this.openSnackBar(content);
  }

  onPublish(QuizId, title, content, quizTopic, questions: [], publish) {
    this.isChecked = !this.isChecked;

    this.quizService
      .publishQuiz(QuizId, title, content, quizTopic, questions, !publish)
      .subscribe(() => {
        this.quizService.getMyQuizzes(
          this.PostsPerPage,
          this.currentPage,
          this.userId
        );
      });
  }

  onDelete(QuizId: string) {
    this.isLoading = true;
    this.quizService.deleteQuiz(QuizId).subscribe(() => {
      this.quizService.getMyQuizzes(
        this.PostsPerPage,
        this.currentPage,
        this.userId
      );
    });

    if (this.quizzes.length === 1) {
      window.location.reload();
    }
  }

  onCreate() {
    const quiz = { title: 'title', content: 'content', quizTopic: 'topic' };
    this.quizService.addQuiz(quiz).subscribe(() => {
      this.quizService.getMyQuizzes(
        this.PostsPerPage,
        this.currentPage,
        this.userId
      );
    });
  }

  ngOnDestroy() {
    this.Sub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onChangedPage(pageData: PageEvent) {
    this._ListFilter = '';
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.PostsPerPage = pageData.pageSize;
    this.quizService.getMyQuizzes(
      this.PostsPerPage,
      this.currentPage,
      this.userId
    );
  }
}
