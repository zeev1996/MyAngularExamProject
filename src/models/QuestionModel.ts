export interface Question
{
  id:string;
  content:string;
  rightAnswers:string[];
  answers:string[];
  questionType:string;
  quizId:string;
  topic:string;
}
