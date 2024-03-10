const User = require("../../model/user/user");
const Comment = require("../../model/comment/Comment");
const bcrypt = require("bcryptjs");
const appErr = require("../../utils/appErr");

// register
const registerCtrl = async (req, res, next) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    return res.render("users/register", { error: "All Fields Are Required" });
  }
  try {
    // check if user already exists
    const userFound = await User.findOne({ email });

    // throw error
    if (userFound) {
      return res.render("users/register", { error: "Email Already Exists" });
    }
    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(password, salt);

    // register User
    const user = await User.create({
      fullname,
      email,
      password: passwordHashed,
    });
    // redirect
    res.redirect("/api/v1/users/profile-page");
  } catch (error) {
    res.json(error);
  }
};

//login
const loginCtrl = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render("users/login", { error: "All Fields Are Required" });
  }
  try {
    const userFound = await User.findOne({ email });
    if (!userFound) {
      return res.render("users/login", { error: "User Does Not Exist" });
    }
    const isPasswordValid = await bcrypt.compare(password, userFound.password);

    if (!isPasswordValid) {
      return res.render("users/login", { error: "Invalid Login Credentials" });
    }

    req.session.userAuth = userFound._id;

    res.redirect("/api/v1/users/profile-page");
  } catch (error) {
    next(appErr(error.message));
  }
};

//profile
const profileCtrl = async (req, res) => {
  try {
    // get User
    const userId = req.session.userAuth;

    // find the user
    const user = await User.findById(userId)
      .populate("posts")
      .populate("comments");

    res.render("users/profile", { user });
  } catch (error) {
    res.json(error);
  }
};

//display
const userDetailsCtrl = async (req, res) => {
  try {
    // find user id from params
    const userId = req.params.id;
    // find user
    const user = await User.findById(userId);

    res.render("users/update", { user, error: "" });
  } catch (error) {
    res.json(error);
  }
};
// update
const updateUserCtrl = async (req, res, next) => {
  const { email, fullname } = req.body;

  try {
    if (!fullname || !email) {
      return res.render("users/update", {
        error: "Provide All Details",
        user: "",
      });
    }
    if (email) {
      const emailTaken = await User.findOne({ email });
      if (emailTaken) {
        return res.render("users/update", {
          error: "Email is Taken",
          user: "",
        });
      }
    }
    // update user

    await User.findByIdAndUpdate(
      req.session.userAuth,
      {
        fullname,
        email,
      },
      { new: true }
    );
    res.redirect("/api/v1/users/profile-page");
  } catch (error) {
    res.render("users/update", {
      error: error.message,
      user: "",
    });
  }
};

// upload profile photo

const uploadProfilePhotoCtrl = async (req, res, next) => {
  try {
    // check if file exist
    if (!req.file) {
      res.render("users/uploadProfilePhoto", { error: "Please Upload Image" });
    }
    // Find the user to be upload
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);

    // check user found
    if (!userFound) {
      res.render("users/login", { error: "User Not Found" });
    }

    // update profile photo
    await User.findByIdAndUpdate(
      userId,
      {
        profileImage: req.file.path,
      },
      { new: true }
    );

    res.redirect("/api/v1/users/pofile-page");
  } catch (error) {
    res.render("users/uploadProfilePhoto", {
      error: error.message,
    });
  }
};

//cover photo

const uploadCoverphotoCtrl = async (req, res, next) => {
  try {
    if (!req.file) {
      res.render("users/uploadCoverPhoto", {
        error: "Please Provide Image",
      });
    }
    // Find the user to be upload
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);

    // check user found
    if (!userFound) {
      res.render("users/login", { error: "User Not Found" });
    }

    // update cover photo
    await User.findByIdAndUpdate(
      userId,
      {
        coverImage: req.file.path,
      },
      { new: true }
    );

    res.redirect("/api/v1/users/profile-page");
  } catch (error) {
    res.render("users/uploadCoverPhoto", {
      error: error.message,
    });
  }
};
// update password
const updatepasswordCtrl = async (req, res, next) => {
  const { password } = req.body;
  try {
    if (!password) {
      return res.render("users/updatePassword", {
        error: "Please Provide Password",
        user: "",
      });
    }
    // check if user is updating password
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const passwordHashed = await bcrypt.hash(password, salt);
      // update user
      await User.findByIdAndUpdate(
        req.session.userAuth,
        { password: passwordHashed },
        { new: true }
      );
    }
    res.redirect("/api/v1/users/profile-page");
  } catch (error) {
    res.render("users/update", {
      error: error.message,
      user: "",
    });
  }
};

// logout

const logoutCtrl = async (req, res) => {
  //destroy session
  req.session.destroy(() => {
    res.redirect("/api/v1/users/login");
  });
};

//  export
module.exports = {
  registerCtrl,
  loginCtrl,
  userDetailsCtrl,
  profileCtrl,
  updateUserCtrl,
  uploadProfilePhotoCtrl,
  uploadCoverphotoCtrl,
  updatepasswordCtrl,
  logoutCtrl,
};
