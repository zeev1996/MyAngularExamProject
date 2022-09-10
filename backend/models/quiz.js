const mongoose= require('mongoose');

const QuizSchema=mongoose.Schema({
title:{type:String,required:true},
createdAt:{type:Date,default: Date.now},
content:{type:String,required:true},
quizTopic:{type:String,required:true},
questions:[{type:Object,ref:"Question"}],
passingGrade:{type:Number,default:60},
publish:{type:Boolean,default:false},
quizCreator:{type:mongoose.Types.ObjectId, ref:"Users"}





},{ saveErrorIfNotFound: true });

module.exports =mongoose.model('Quiz',QuizSchema);
