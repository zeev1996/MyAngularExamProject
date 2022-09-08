const express = require("express");
const question = require("../models/question");
const checkAuth = require("../Middleware/check-auth");

const Question = require("../models/question");


const router = express.Router();

router.post("",checkAuth,async (req, res, next) => {
  const question = new Question({
    content: req.body.content,
    answers: req.body.answers,
    questionType: req.body.questionType,
    rightAnswers: req.body.rightAnswers,
    quiz: req.body.quizId,
    topic:req.body.topic
  });
 await question
    .save()
    .then((createdQuestion) => {
      res.status(201).json({
        message: "Question added successfully",
        question: {
          ...createdQuestion,
          id: createdQuestion._id,
        },
      });
    })
    .catch((error) => {
      res.status(404).json({
        message: "Faild to create Question",
      });
    });
});

router.get("/byQuizId/:id",async (req, res, next) => {
await  Question.find({ quiz: req.params.id }).then((question) => {
    if (question) {
      res.status(200).json(question);
    } else {
      res.status(404).json({ message: "questions not found!" });
    }
  }) .catch((error) => {
    res.status(500).json({
      message: "Faild to get question",
    });
  });;
});

router.get("",async (req, res) => {
  Question.find(await function (err, result) {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  }) .catch((error) => {
    res.status(500).json({
      message: "Faild to get question",
    });
  });;
});

router.get("/:id", async (req, res, next) => {
  await Question.findById(req.params.id).then((Question) => {
    if (Question) {
      res.status(200).json(Question);
    } else {
      res.status(404).json({ message: "Question not found!" });
    }
  }) .catch((error) => {
    res.status(500).json({
      message: "Faild to get question",
    });
  });;
});

router.put("/:id", checkAuth,async (req, res, next) => {
  const question = new Question({
    _id: req.body.id,
    content: req.body.content,
    rightAnswers: req.body.rightAnswers,
    answers: req.body.answers,
    questionType: req.body.questionType,
    quiz: req.body.quizId,
    topic:req.body.topic
  });

 await question.updateOne({ _id: req.params.id }, question)
    .then((result) => {
      res.status(200).json({ message: "Update successful!" });
    })
    .catch((error) => {
      res.status(404).json({
        message: "Faild to update question",
      });
    })
});

router.delete("/:id",checkAuth , async (req, res, next) => {
await Question.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Question is deleted!" });
  });
});
module.exports = router;
