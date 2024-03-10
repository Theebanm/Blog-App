const Comment = require("../../model/comment/Comment");
const Post = require("../../model/post/Post");
const User = require("../../model/user/user");
const appErr = require("../../utils/appErr");

// create
const createCommentCtrl = async (req, res, next) => {
  const { message } = req.body;
  try {
    // find the post
    const post = await Post.findById(req.params.id);
    // create comment
    const comment = await Comment.create({
      user: req.session.userAuth,
      message,
      post: post._id,
    });
    // push comment

    post.comments.push(comment._id);
    // find user
    const user = await User.findById(req.session.userAuth);

    user.comments.push(comment._id);
    // disable validation
    // save
    post.save({ validateBeforeSave: false });
    user.save({ validateBeforeSave: false });
    // redirect
    res.redirect(`/api/v1/posts/${post._id}`);
  } catch (error) {
    next(appErr(error));
  }
};

// Fetch command
const commandDetailsCtrl = async (req, res, next) => {
  try {
    // fetch the post

    const comment = await Comment.findById(req.params.id);
    res.render("comments/updateComment", {
      comment,
      error: "",
    });
  } catch (error) {
    res.render("comments/updateComment", {
      comment,
      error: error.message,
    });
  }
};

//delete

const deleteCommentCtrl = async (req, res, next) => {
  try {
    // find comment

    const comment = await Comment.findById(req.params.id);

    // check the  comment of user

    if (comment.user.toString() !== req.session.userAuth.toString()) {
      return next(appErr("You are Not allowed to Delete comment", 403));
    }
    // delete
    await Comment.findByIdAndDelete(req.params.id);
    res.redirect(`/api/v1/posts/${req.query.postId}`);
  } catch (error) {
    next(appErr(error));
  }
};

// update
const updateCommentctrl = async (req, res, next) => {
  const { message } = req.body;
  try {
    if (!message) {
      return next(appErr("Comment not Found", 403));
    }
    // find comment
    const comment = await Comment.findById(req.params.id);
    // check the  comment of user

    if (comment.user.toString() !== req.session.userAuth.toString()) {
      return next(appErr("You are Not allowed to update comment", 403));
    }
    await Comment.findByIdAndUpdate(req.params.id, { message }, { new: true });

    res.redirect(`/api/v1/posts/${req.query.postId}`);
  } catch (error) {
    next(appErr(error.message));
  }
};

// export

module.exports = {
  createCommentCtrl,
  commandDetailsCtrl,
  updateCommentctrl,
  deleteCommentCtrl,
};
