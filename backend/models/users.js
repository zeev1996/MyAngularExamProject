const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isTeacher:{type:Boolean,default:false},
  isAdmin:{type:Boolean,default:false},
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Users", userSchema);
