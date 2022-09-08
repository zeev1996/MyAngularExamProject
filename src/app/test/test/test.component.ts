import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/Repository/auth.service';
import { QuestionService } from 'src/app/Repository/questionService';
import { QuizService } from 'src/app/Repository/quizService';
import { Question } from 'src/models/QuestionModel';
import { Quiz } from 'src/models/QuizModel';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit,OnDestroy {
quiz:Quiz;
questions:Question[];
sub:Subscription;
userId:string;
isloading =false;
quizId:string;
title:string;
content:string;
topic:string;


  constructor(private authService:AuthService,private quizService:QuizService,private questionService:QuestionService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.isloading = true;
    this.userId = this.authService.getUserId();

    this.sub = this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.quizId = paramMap.get('id');
        this.quizService.getQuiz(this.quizId).subscribe({
          next: (quizData) => {
            this.isloading = false;
            this.title = quizData.title;
            this.topic = quizData.quizTopic;
            this.content = quizData.content;
            this.userId = this.authService.getUserId();
          }
        });

        this.questionService.getQuestionsByQuizId(this.quizId).subscribe({
          next: (questions) => {
            this.questions = questions;

          },
        });
      }
    });
  }

  ngOnDestroy():void{
this.sub.unsubscribe();
  }

}
