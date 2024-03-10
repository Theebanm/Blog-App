const express = require("express");
const {
  createCommentCtrl,
  commandDetailsCtrl,
  deleteCommentCtrl,
  updateCommentctrl,
} = require("../../controllers/comments/comments");
const protected = require("../../middlewares/protected");

const commentRoute = express.Router();
//! --------------------

// Post/api/v1/comments
commentRoute.post("/:id", protected, createCommentCtrl);

// get/api/v1/comments/:id
commentRoute.get("/:id", commandDetailsCtrl);

// delete/api/v1/comments/:id
commentRoute.delete("/:id", protected, deleteCommentCtrl);

// put/api/v1/comments/:id
commentRoute.put("/:id", protected, updateCommentctrl);
//! --------------------

// export

module.exports = commentRoute;
