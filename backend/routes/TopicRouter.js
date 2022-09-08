const express = require("express");
const checkAuth = require("../Middleware/check-auth");
const Topic = require("../models/topics");
const router = express.Router();
module.exports = router;


router.get("",async (req, res, next) => {
  await  Topic.find().then((topic) => {
      if (topic) {
        res.status(200).json(topic);
      } else {
        res.status(404).json({ message: "topic not found!" });
      }
    }) .catch((error) => {
      res.status(500).json({
        message: "Faild to get topic",
      });
    });;
  });

  router.post("",checkAuth,async (req, res, next) => {
    const topic = new Topic({
     name:req.body.name
    });
   await topic
      .save()
      .then((createdTopic) => {
        res.status(201).json({
          message: "Topic added successfully",
          question: {
            ...createdTopic,
            id: createdTopic._id,
          },
        });
      })
      .catch((error) => {
        res.status(500).json({
          message: "Faild to create Topic",
        });
      });
  });
