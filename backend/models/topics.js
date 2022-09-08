const mongoose= require('mongoose');
const TopicSchema=mongoose.Schema({
  name:{type:String,required:true}
})
module.exports = mongoose.model("Topic",TopicSchema);

