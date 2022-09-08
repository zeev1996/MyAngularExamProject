import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/Repository/auth.service';
import { QuestionService } from 'src/app/Repository/questionService';
import { QuizService } from 'src/app/Repository/quizService';
import { TopicService } from 'src/app/Repository/topicService';
import { Quiz } from 'src/models/QuizModel';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
})
export class QuizComponent implements OnInit, OnDestroy {
  FormGroup: FormGroup;
  userId: string;
  questions: any[] = [];
  title: string = 'Quiz title';
  topics: any[] = [];
  topic: string = 'quiz topic';
  content: string = 'Quiz instructions';
  sub!: Subscription;
  quizid: string;
  quiz: Quiz;
  isloading = false;
  constructor(
    private topicService: TopicService,
    private authservice: AuthService,
    private _formBuilder: FormBuilder,
    private questionService: QuestionService,
    private quizService: QuizService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isloading = true;
    this.userId = this.authservice.getUserId();
    this.FormGroup = this._formBuilder.group({
      title: ['', Validators.required],
      topic: ['', Validators.required],
      instructions: ['', Validators.required],
    });
    this.sub = this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.quizid = paramMap.get('id');
        this.topicService.getTopics().subscribe({
          next: (topics) => {
            console.log(topics)
            this.topics = topics;
          },
        });
        this.quizService.getQuiz(this.quizid).subscribe({
          next: (quizData) => {
            this.isloading = false;
            this.title = quizData.title;
            this.topic = quizData.quizTopic;
            this.content = quizData.content;
            this.userId = this.authservice.getUserId();
          },
        });

        this.questionService.getQuestionsByQuizId(this.quizid).subscribe({
          next: (questions) => {
            this.questions = questions;
          },
        });
      }
    });
  }
  onDeletedQuestion(id: string) {
    this.questionService.deleteQuestion(id).subscribe(() => {

      this.questionService.getQuestionsByQuizId(this.quizid).subscribe({
        next: (questions) => {
          this.questions = questions;
          this.quizService.updateQuiz(
            this.quizid,
            this.title,
            this.content,
            this.topic,
            this.questions
          ).subscribe()
        },
      });
    });
  }
  onClick() {
    this.title = '';
    this.topic = '';
    this.content = '';
  }

  onSubmit() {
    this.isloading = true;
    this.quizService
      .updateQuiz(
        this.quizid,
        this.title,
        this.content,
        this.topic,
        this.questions
      )
      .subscribe(() => {
        this.isloading = false;
      });
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
