import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionComponent } from 'src/app/questionGenerator/question/question.component';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from 'src/app/login/login/login.component';
import { SignupComponent } from 'src/app/signup/signup/signup.component';
import { QuizListMenuComponent } from 'src/app/quizlist/quiz-list-menu/quiz-list-menu.component';
import { QuizComponent } from 'src/app/quizGenerator/quiz/quiz.component';
import { AuthGuard } from 'src/app/Repository/auth.guard';
import { UserTypeGuard } from 'src/app/Repository/user-type.guard';
import { TestComponent } from 'src/app/test/test/test.component';
import { AdminGuard } from 'src/app/Repository/admin.guard';
import { AdminComponent } from 'src/app/admin/admin/admin.component';
import { MyQuizzesComponent } from 'src/app/quizlist/my-quizzes/my-quizzes.component';
const routes:Routes=[
  {path:'',component:QuizListMenuComponent},
  {path:'edit/:id' ,component:QuizComponent ,canActivate:[UserTypeGuard]},
  {path:'edit/:id/createQuestion' ,component:QuestionComponent ,canActivate:[UserTypeGuard]},
  {path:'login' ,component: LoginComponent},
  {path:'signup' ,component:SignupComponent},
  {path:"administry",component:AdminComponent,canActivate:[AdminGuard]},
  {path:'myQuizzes' ,component:MyQuizzesComponent ,canActivate:[UserTypeGuard]},
  {path:'Ex/:id' ,component:TestComponent,canActivate:[AuthGuard]},

];


@NgModule({
  declarations: [],
  providers:[AuthGuard,UserTypeGuard,AdminGuard],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports:[ RouterModule]

})
export class RoutingModule { }
