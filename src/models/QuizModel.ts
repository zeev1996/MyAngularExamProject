import { Question } from "./QuestionModel";

export interface Quiz
{
  id:string;
  title:string;
  content:string,
  quizTopic:string;
  questions:string[];
  QuizCreator:string;
  publish:boolean
}
