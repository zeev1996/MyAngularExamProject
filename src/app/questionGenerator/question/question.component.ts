import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { QuestionService } from 'src/app/Repository/questionService';
import { QuizService } from 'src/app/Repository/quizService';
import { Question } from 'src/models/QuestionModel';
import { Quiz } from 'src/models/QuizModel';

@Component({
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
})
export class QuestionComponent implements OnInit, OnDestroy {
  selected = 'SingleQuestionAnswer';
  questionTypes: string[] = ['SingleQuestionAnswer', 'MultiQuestionAnswer'];
  answerstring: string[] = [];
  rightAnswer: string = '';
  rightAnswers: string[] = [];
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  Checkboxform: FormGroup;
  selectedAnswers: FormArray;
  private prevAnswer: boolean = false;
  public quizid: string;
  isloading = false;
  submited = false;
  quiz: Quiz;
  constructor(
    private _formBuilder: FormBuilder,
    private questionService: QuestionService,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private quizService: QuizService
  ) {}

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      content: ['', Validators.required],
    });

    this.secondFormGroup = this._formBuilder.group({
      answer: ['', Validators.required],
    });
    this.Checkboxform = this._formBuilder.group({
      selectedAnswers: this._formBuilder.array([], [Validators.required]),
    });
    this.selectedAnswers = this.Checkboxform.get(
      'selectedAnswers'
    ) as FormArray;

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.quizid = paramMap.get('id');
        this.quizService.getQuiz(this.quizid).subscribe((quiz) => {
          this.quiz = quiz;
        });
      }
    });
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'ok');
  }
  onSubmit() {
    const rightanswers: string[] = [];
    if (
      this.selected === 'SingleQuestionAnswer' &&
      this.rightAnswer != '' &&
      this.answerstring.length > 1
    ) {
      this.isloading = true;

      rightanswers.push(this.rightAnswer);
      let question: Question = {
        id: '',
        content: this.firstFormGroup.value.content,
        rightAnswers: rightanswers,
        questionType: this.selected,
        answers: this.answerstring,
        quizId: this.quizid,
        topic: this.quiz.quizTopic,
      };
      this.questionService.addQuestion(question).subscribe(() => {
        this.isloading = false;
      });
      this.submited = true;
    } else if (
      this.selected === 'MultiQuestionAnswer' &&
      this.rightAnswers.length > 1 &&
      this.answerstring.length > 2
    ) {
      this.isloading = true;
      let question: Question = {
        id: '',
        content: this.firstFormGroup.value.content,
        rightAnswers: this.rightAnswers,
        questionType: this.selected,
        answers: this.answerstring,
        quizId: this.quizid,
        topic: this.quiz.quizTopic,
      };
      this.questionService.addQuestion(question).subscribe(() => {
        this.isloading = false;
      });
      this.submited = true;
    }

    if (this.selected === 'MultiQuestionAnswer') {
      if (this.rightAnswers.length < 2) {
        this.openSnackBar(
          'at least 2 answers must be selected for a multi answer question'
        );
      }

      if (this.answerstring.length < 2) {
        this.openSnackBar(
          'at least 3 answers must be added for a multi answer question'
        );
      }
    }

    if (this.selected === 'SingleQuestionAnswer') {
      if (this.rightAnswer === '')
        this.openSnackBar('please select the right answer');
      if (this.answerstring.length <= 1) {
        this.openSnackBar(
          'you need to add at least 2 answers for single answer question'
        );
      }
    }
    if (this.submited === true) {
      this.submited = false;
      this.onReset();
    }
  }

  onCheck(event: MatCheckboxChange) {
    if (event.source.checked) {
      if (this.selectedAnswers.length < 4) {
        this.selectedAnswers.push(new FormControl(event.source.value));
        this.rightAnswers.push(event.source.value);
      }
    } else {
      const index = this.selectedAnswers.controls.findIndex(
        (x) => x.value === event.source.value
      );
      this.selectedAnswers.removeAt(index);
      this.rightAnswers.splice(index, 1);
    }
  }
  onSelect() {
    console.log(this.selected);
    if (this.selectedAnswers.length > 0) this.selectedAnswers.clear();
  }
  onReset() {
    this.answerstring = [];
    this.rightAnswer = '';
    this.selectedAnswers.clear();
    this.rightAnswers = [];
  }

  onAdd() {
    if (
      this.firstFormGroup.value.content != null &&
      this.firstFormGroup.value.content != ''
    ) {
      if (
        this.secondFormGroup.value.answer != null &&
        this.secondFormGroup.value.answer != '' &&
        this.answerstring.length < 4
      ) {
        this.answerstring.forEach((element) => {
          if (element == this.secondFormGroup.value.answer) {
            this.prevAnswer = true;
          }
        });
        if (this.prevAnswer === false) {
          this.answerstring.push(this.secondFormGroup.value.answer);
        } else {
          this.openSnackBar('you cant add more then one of the same answer');
        }
        this.prevAnswer = false;
      } else {
        if (
          (this.secondFormGroup.value.answer =
            null || this.secondFormGroup.value.answer === '')
        )
          this.openSnackBar('make sure you write an answer before adding it ');
        else {
          this.openSnackBar('only 4 answer options are allowed in a question');
        }
      }
    }
  }
  ngOnDestroy(): void {}
}
