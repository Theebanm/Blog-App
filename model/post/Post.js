const mongoose = require("mongoose");

//title, desc, category, image
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["react js", "html", "css", "node js", "javascript", "other"],
    },
    image: {
      type: String,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    role: {
      type: String,
      default: "Blogger",
    },
    bio: {
      type: String,
      default:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis quod, voluptatum, quia, voluptas quas voluptates quibusdam voluptatibus quae quidem quos nesciunt. Quisquam, quae voluptatibus. Quisquam, quae voluptatibus.",
    },
  },
  {
    timestamps: true,
  }
);

//compile schema to form model

const Post = mongoose.model("Post", postSchema);

//export model
module.exports = Post;
