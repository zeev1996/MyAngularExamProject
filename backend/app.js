const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const QuestionRoutes = require("./routes/QuestionRouter");
const QuizRoutes=require("./routes/QuizRouter");
const UserRoutes=require("./routes/UserRouter")
const TopicRoutes=require("./routes/TopicRouter")
const app = express();

mongoose
  .connect(
    "mongodb+srv://zeev1996:Zeev21031996@cluster0.vd1giaz.mongodb.net/QuizProject"
  )
  .then(() => {
    console.log("Connected to database");
  })
  .catch(() => {
    console.log("Connection failed");
  });

  app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/questions", QuestionRoutes);
app.use("/api/quizzes",QuizRoutes);
app.use("/api/users", UserRoutes);
app.use("/api/topics", TopicRoutes);


module.exports = app;
