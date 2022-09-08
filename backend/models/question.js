const mongoose= require('mongoose');

const QuestionSchema=mongoose.Schema({
content:{type:String,required:true},
rightAnswers:[{type:String,required:true}],
answers:[{type:String,required:true}],
questionType:{type:String,required:true},
quiz:{type:mongoose.Types.ObjectId,ref:'Quiz'},
questionCreator: {type:mongoose.Types.ObjectId, ref: 'Users'},
topic:{type:String}






},{ saveErrorIfNotFound: true });

module.exports =mongoose.model('Question',QuestionSchema);
