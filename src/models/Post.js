const { model, Schema, mongoose } = require("mongoose");

const postSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Post", postSchema);
