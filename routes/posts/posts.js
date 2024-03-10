const express = require("express");
const protected = require("../../middlewares/protected");
const postRoute = express.Router();
const multer = require("multer");
const storage = require("../../config/cloudinary");
const {
  createPostCtrl,
  fetchPostsCtrl,
  fetchPostCtrl,
  deletePostCrl,
  updatePostCtrl,
} = require("../../controllers/posts/posts");
const Post = require("../../model/post/Post");

// instance of multer
const upload = multer({ storage });

//! --------------------
postRoute.get("/get-post-form", (req, res) => {
  res.render("posts/addPost", { error: "" });
});
postRoute.get("/get-form-update/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.render("posts/addPost", { post, error: "" });
  } catch (error) {
    res.render("posts/addPost", { post: "", error });
  }
});

// !  =====================
// Post/api/v1/posts
postRoute.post("/", protected, upload.single("file"), createPostCtrl);

// get
// Get/api/v1/posts
postRoute.get("/", fetchPostsCtrl);

// posts/api/v1/posts/:id
postRoute.get("/:id", fetchPostCtrl);

// delete/api/v1/posts/:id
postRoute.delete("/:id", protected, deletePostCrl);

// put/api/v1/posts/:id
postRoute.put("/:id", protected, updatePostCtrl);

//! --------------------

// export
module.exports = postRoute;
