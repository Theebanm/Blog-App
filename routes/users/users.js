const express = require("express");
const userRoutes = express.Router();
const {
  registerCtrl,
  loginCtrl,
  userDetailsCtrl,
  profileCtrl,
  updateUserCtrl,
  uploadProfilePhotoCtrl,
  uploadCoverphotoCtrl,
  updatepasswordCtrl,
  logoutCtrl,
} = require("../../controllers/users/users");
const protected = require("../../middlewares/protected");
const storage = require("../../config/cloudinary");
const multer = require("multer");
// instance of multer

const upload = multer({ storage });

// rendering Forms
// login form
userRoutes.get("/login", (req, res) => {
  res.render("users/login", { error: "" });
});
// register form
userRoutes.get("/register", (req, res) => {
  res.render("users/register", { error: "" });
});

// upload profile photo
userRoutes.get("/upload-profile-photo-form", (req, res) => {
  res.render("users/uploadProfilePhoto", { error: "" });
});
// upload cover photo
userRoutes.get("/upload-cover-photo-form", (req, res) => {
  res.render("users/uploadCoverPhoto", { error: "" });
});
// update user password
userRoutes.get("/update-user-password", (req, res) => {
  res.render("users/updatePassword", { error: "" });
});

// register

// post/api/v1/users/register
userRoutes.post("/register", registerCtrl);
// post/api/v1/users/login
userRoutes.post("/login", loginCtrl);

// get/api/v1/users/profile
userRoutes.get("/profile-page", protected, profileCtrl);

// put/api/v1/users/update/:id
userRoutes.put("/update", updateUserCtrl);

// put/api/v1/users/profile-photo-upload/:id
userRoutes.put(
  "/profile-photo-upload",
  protected,
  upload.single("profile"),
  uploadProfilePhotoCtrl
);
// put/api/v1/users/cover-photo-upload/:id
userRoutes.put(
  "/cover-photo-upload",
  protected,
  upload.single("cover"),
  uploadCoverphotoCtrl
);

// put/api/v1/users/update-password/:id

userRoutes.put("/update-password", updatepasswordCtrl);
// Get/api/v1/users/logout
userRoutes.get("/logout", logoutCtrl);

// Get/api/v1/users/:id
userRoutes.get("/:id", userDetailsCtrl);

module.exports = userRoutes;
