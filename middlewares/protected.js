const appErr = require("../utils/appErr");

const protected = (req, res, next) => {
  // chech if user is login
  if (req.session.userAuth) {
    next();
  } else {
    res.render("users/notAuthorize");
  }
};

module.exports = protected;
