require("dotenv").config();
const express = require("express");
const session = require("express-session");
const methodOverride = require("method-override");
const dbConnect = require("./config/dbConnect");
const MongoStore = require("connect-mongo");
const userRoutes = require("./routes/users/users");
const postRoute = require("./routes/posts/posts");
const commentRoute = require("./routes/comments/comments");
const globalErrHandler = require("./middlewares/globalhandler");
const Post = require("./model/post/Post");
const { truncatePost } = require("./utils/helpers");
const app = express();

// helpers

app.locals.truncatePost = truncatePost;

// middlewares
//! --------------------
// app.use(express.json());
// pass form data
app.use(express.urlencoded({ extended: true }));
// method over ride
app.use(methodOverride("_method"));
// config ejs
app.set("view engine", "ejs");
//  serve static files
app.use(express.static(__dirname + "/public"));

// session config

app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      mongoUrl: process.env.MONGO_URL,
      ttl: 24 * 60 * 60, //1 day
    }),
  })
);

// save the login user into local
app.use((req, res, next) => {
  if (req.session.userAuth) {
    res.locals.userAuth = req.session.userAuth;
  } else {
    res.locals.userAuth = null;
  }
  next();
});

// render home

app.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("user");
    res.render("index", { posts });
  } catch (error) {
    res.render("index", { error: error.message });
  }
});

//! 1.Users Routes
app.use("/api/v1/users", userRoutes);

//! --------------------

//! 2.Post Routes

app.use("/api/v1/posts", postRoute);

//! --------------------

//! 3.Comments Route
app.use("/api/v1/comments", commentRoute);

//! --------------------

//Error handling Middleware

app.use(globalErrHandler);
//listen server

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});

dbConnect();
