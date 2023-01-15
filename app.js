const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");
mongoose.set("strictQuery", false);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const wikiSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Article", wikiSchema);

// Handling requests targeting all articles //

app
  .route("/articles")

  .get((req, res) => {
    Article.find((err, foundArticles) => {
      if (err) {
        res.send(err);
      } else {
        res.send(foundArticles);
      }
    });
  })

  .post((req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    const article = new Article({
      title: title,
      content: content,
    });
    article.save((err) => {
      if (!err) {
        res.send("Successfully saved in db");
      } else {
        res.send(err);
      }
    });
  })

  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (!err) {
        res.send("Successfully deleted all articles");
      } else {
        console.log("Something went wrong. Try Again!");
      }
    });
  });

// Handling requests targeting a particular article //

app
  .route("/articles/:articleTitle")

  .get((req, res) => {
    const articleTitle = req.params.articleTitle;
    Article.findOne({ title: articleTitle }, (err, foundArticle) => {
      if (!err) {
        res.send(foundArticle);
      } else {
        res.send("No maching article found!");
      }
    });
  })

  .put((req, res) => {
    const articleTitle = req.params.articleTitle;
    console.log(articleTitle);
    console.log(req.body.title, req.body.content);
    Article.replaceOne(
      { title: articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      (err, result) => {
        if (!err) {
          res.send("Successfully updated article");
        } else {
          res.send(err);
        }
      }
    );
  })

  .patch((req, res) => {
    const articleTitle = req.params.articleTitle;
    Article.updateOne({ title: articleTitle }, { $set: req.body }, (err) => {
      res.send("Successfully updated article");
    });
  })

  .delete((req, res) => {
    const articleTitle = req.params.articleTitle;
    Article.deleteOne({ title: articleTitle }, (err) => {
      if (!err) {
        res.send("Successfully deleted the article");
      } else {
        res.send("Something went wrong. Try again!!");
      }
    });
  });

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
