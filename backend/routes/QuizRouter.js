const express = require("express");
const Quiz = require("../models/quiz");
const router = express.Router();
const checkAuth = require("../Middleware/check-auth");
module.exports = router;

router.get("",async (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentpage =+req.query.page;
   const QuizQuery =  Quiz.find({ publish:true });
  let fetchedQuizzes;
  if (pageSize && currentpage) {
    QuizQuery.skip(pageSize * (currentpage - 1)).limit(pageSize);
  }
 await QuizQuery.then((documents) => {
    fetchedQuizzes = documents;
    return  Quiz.count({ publish: true });
  }).then((count) => {
    res.status(200).json({
      message: "Quizzes fetched successfully!",
      quizzes: fetchedQuizzes,
      maxQuizzes: count,
    });
  }) .catch((error) => {
    res.status(404).json({
      message: "Faild to get Quizz",
    });
  });
});

router.get("/myQuizzes/:id",checkAuth, async (req, res, next) => {

  const pageSize = +req.query.pagesize;
  const currentpage = +req.query.page;
  const QuizQuery = Quiz.find({ quizCreator: req.params.id });
  let fetchedQuizzes;
  if (pageSize && currentpage) {
   QuizQuery.skip(pageSize * (currentpage - 1)).limit(pageSize);
  }
  await QuizQuery.then((documents) => {
    fetchedQuizzes = documents;
    return  Quiz.count({ quizCreator: req.params.id });
  }).then((count) => {
    console.log(count);
    res.status(200).json({
      message: "Quizzes fetched successfully!",
      quizzes: fetchedQuizzes,
      maxQuizzes: count,
    });
  }) .catch((error) => {
    res.status(404).json({
      message: "Faild to get Quizz",
    });
  });
});
router.get("/byTopic/:id", async (req, res, next) => {

  const pageSize = +req.query.pagesize;
  const currentpage = +req.query.page;
  const QuizQuery = Quiz.find({ quizTopic: req.params.id, publish:true });
  let fetchedQuizzes;
  if (pageSize && currentpage) {
   QuizQuery.skip(pageSize * (currentpage - 1)).limit(pageSize);
  }
  await QuizQuery.then((documents) => {
    fetchedQuizzes = documents;
    return  Quiz.count({ quizTopic: req.params.id,publish:true });
  }).then((count) => {
    console.log(count);
    res.status(200).json({
      message: "Quizzes fetched successfully!",
      quizzes: fetchedQuizzes,
      maxQuizzes: count,
    });
  }) .catch((error) => {
    res.status(404).json({
      message: "Faild to get Quizz",
    });
  });
});

router.post("", checkAuth,async (req, res, next) => {
  const quiz = new Quiz({
    title: req.body.title,
    content: req.body.content,
    quizTopic: req.body.quizTopic,
    questions: req.body.questions,
    quizCreator: req.userData.userId,
    publish: req.body.publish,
  });
 await quiz
    .save()
    .then((createdQuizz) => {
      res.status(201).json({
        message: "Quizz added successfully",
        quizz: {
          ...createdQuizz,
          id: createdQuizz._id,
        },
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Faild to crate Quizz",
      });
    });
});
router.delete("/:id", checkAuth,async (req, res, next) => {
 await Quiz.deleteOne({ _id: req.params.id, quizCreator: req.userData.userId })
    .then((result) => {
      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Delete successful!" });
      } else {
        res.status(401).json({ message: "Not Authorized" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Faild to delete Quizz",
      });
    });
});



router.put("/:id", checkAuth,async (req, res, next) => {
  const quiz = new Quiz({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    quizTopic: req.body.quizTopic,
    questions: req.body.questions,
    QuizCreator: req.userData.userId,
    publish: req.body.publish,
  });
await Quiz.updateOne({ _id: req.params.id, quizCreator: req.userData.userId }, quiz)
    .then((result) => {
      if (result.modifiedCount > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not Authorized" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Faild to update Quizz",
      });
    });
});

router.get("/:id",async (req, res, next) => {
 await Quiz.findById(req.params.id).then((quiz) => {
    if (quiz) {
      res.status(200).json(quiz);
    } else {
      res.status(404).json({ message: "Quiz not found!" });
    }
  }) .catch((error) => {
    res.status(500).json({
      message: "Faild to get Quizz",
    });
  });;
});
