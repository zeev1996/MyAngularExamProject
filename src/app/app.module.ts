import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { QuestionComponent } from './questionGenerator/question/question.component';
import { QuizComponent } from './quizGenerator/quiz/quiz.component';
import { HeaderComponent } from './header/header/header.component';
import { RoutingModule } from './routing/routing/routing.module';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login/login.component';
import { SignupComponent } from './signup/signup/signup.component';
import { QuizListMenuComponent } from './quizlist/quiz-list-menu/quiz-list-menu.component';
import { AuthInterceptor } from './Repository/auth-interceptor';
import { CommonModule } from '@angular/common';
import { TestComponent } from './test/test/test.component';
import { AdminComponent } from './admin/admin/admin.component';
import { MyQuizzesComponent } from './quizlist/my-quizzes/my-quizzes.component';
import { AngularMaterialModule } from './angular-material/angular-material.module';

@NgModule({
  declarations: [
    AppComponent,
    QuestionComponent,
    QuizComponent,
    HeaderComponent,
    LoginComponent,
    SignupComponent,
    QuizListMenuComponent,
    TestComponent,
    AdminComponent,
    MyQuizzesComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    RoutingModule,
    RouterModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    AngularMaterialModule
  ],

  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
