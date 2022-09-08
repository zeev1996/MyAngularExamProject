import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizListMenuComponent } from './quiz-list-menu.component';

describe('QuizListMenuComponent', () => {
  let component: QuizListMenuComponent;
  let fixture: ComponentFixture<QuizListMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuizListMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizListMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
