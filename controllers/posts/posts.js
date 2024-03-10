const Post = require("../../model/post/Post");
const User = require("../../model/user/user");
const appErr = require("../../utils/appErr");

//create post
const createPostCtrl = async (req, res, next) => {
  const { title, description, category, image, user } = req.body;
  try {
    if (!title || !description || !category) {
      return res.render("posts/addPost", { error: "All Fields Are Required" });
    }
    //find  the user
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);

    const postCreated = await Post.create({
      title,
      description,
      category,
      image: req.file.path,
      user: userFound._id,
    });
    // push post created to users post array
    userFound.posts.push(postCreated._id);

    // resave
    await userFound.save();
    res.redirect("/");
  } catch (error) {
    return res.render("posts/addPost", { error: error.message });
  }
};

// all
const fetchPostsCtrl = async (req, res, next) => {
  try {
    const posts = await Post.find().populate("comments").populate("user");
    res.json({
      status: "Success",
      user: posts,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

// single
const fetchPostCtrl = async (req, res, next) => {
  try {
    // get id from params

    const id = req.params.id;
    // find the post
    const post = await Post.findById(id)
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
      })
      .populate("user");
    res.render("posts/postDetails", { post, error: "" });
  } catch (error) {
    next(appErr(error.message));
  }
};

// delete
const deletePostCrl = async (req, res, next) => {
  try {
    // find post

    const post = await Post.findById(req.params.id);

    // check the  post if user

    if (post.user.toString() !== req.session.userAuth.toString()) {
      return res.render("posts/postDetails", {
        error: "You are Not allowed to Delete Post",
        post: "",
      });
    }
    // delete
    await Post.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (error) {
    return res.render("posts/postDetails", { error: error.message, post: "" });
  }
};

// update
const updatePostCtrl = async (req, res, next) => {
  const { title, description, category } = req.body;
  try {
    if (!title || !description || !category) {
      return next(appErr("Please Provide All Fields"));
    }
    const post = await Post.findById(req.params.id);

    // check the  post if user

    if (post.user.toString() !== req.session.userAuth.toString()) {
      return res.render("posts/updatePost", {
        post: "",
        error: "You Are Not Authorized To Update",
      });
    }
    // check if user is updating
    if (req.file) {
      await Post.findByIdAndUpdate(
        post,
        {
          title,
          description,
          category,
        },
        { new: true }
      );
    } else {
      // update
      await Post.findByIdAndUpdate(
        post,
        {
          title,
          description,
          category,
        },
        { new: true }
      );
    }

    // resave
    post.save();

    res.render("/");
  } catch (error) {
    return res.render("posts/updatePost", {
      post: "",
      error: error.message,
    });
  }
};

module.exports = {
  createPostCtrl,
  fetchPostsCtrl,
  fetchPostCtrl,
  deletePostCrl,
  updatePostCtrl,
};
