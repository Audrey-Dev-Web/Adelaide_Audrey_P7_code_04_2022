const express = require("express");
const router = express.Router();

const articleCtrl = require("../controllers/articles");
const commentCtrl = require("../controllers/comments");

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

// Articles Routes
router.post("/", auth, multer, articleCtrl.createArticle);
router.get("/", auth, articleCtrl.getAllArticles);
router.get("/:id", auth, articleCtrl.getOneArticle);
router.put("/:id", auth, multer, articleCtrl.modifyArticle);
router.delete("/:id", auth, articleCtrl.deleteArticle);

// Shares Routes
router.post("/:id/share", auth, articleCtrl.shareArticle);

// Comments Routes
router.post("/:id/comments", auth, commentCtrl.addComment);
router.get("/:id/comments", auth, commentCtrl.getAllcomments);
router.get("/:id/comments/:comment_id", auth, commentCtrl.getOneComment);
router.put("/:id/comments/:comment_id", auth, commentCtrl.modifyComment);
router.delete("/:id/comments/:comment_id", auth, commentCtrl.deleteComment);

module.exports = router;
