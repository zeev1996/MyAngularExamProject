import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { QuizService } from 'src/app/Repository/quizService';
import { Quiz } from 'src/models/QuizModel';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/Repository/auth.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TopicService } from 'src/app/Repository/topicService';

@Component({
  selector: 'app-quiz-list-menu',
  templateUrl: './quiz-list-menu.component.html',
  styleUrls: ['./quiz-list-menu.component.css'],
})
export class QuizListMenuComponent implements OnInit, OnDestroy {
  quizzes: Quiz[] = [];
  userId: string;
  topic: string = 'none';
  topics: any[] = [];
  isChecked = true;
  authStatusSub: Subscription;
  private _ListFilter: string = '';
  get listFilter(): string {
    return this._ListFilter;
  }
  set listFilter(value: string) {
    this._ListFilter = value;

    if (this.listFilter === '') {
      this.filteredQuizes=this.quizzes
    }
    else{
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
    private topicService: TopicService,
    private quizService: QuizService,
    private _snackBar: MatSnackBar,
    private authservice: AuthService,
    private route: ActivatedRoute
  ) {}
  displayedColumns: string[] = [
    'title',
    'quizTopic',
    'content',
    'ex',
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
    this.topicService.getTopics().subscribe({
      next: (topics) => {
        this.topics = topics;
      },
    });
    this.quizService.getQuizzes(this.PostsPerPage, 1);
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

  onChange() {}

  ngOnDestroy() {
    this.Sub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onChangedPage(pageData: PageEvent) {
    this._ListFilter = '';
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.PostsPerPage = pageData.pageSize;
    this.quizService.getQuizzes(this.PostsPerPage, this.currentPage);
  }
}
