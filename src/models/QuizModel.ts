import { Question } from "./QuestionModel";

export interface Quiz
{
  id:string;
  title:string;
  content:string,
  quizTopic:string;
  questions:Question[];
  QuizCreator:string;
  publish:boolean
}
