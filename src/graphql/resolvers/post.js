const Client = require("../../models/Client");
const Post = require("../../models/Post");
const { ApolloError } = require("apollo-server-errors");
const mongoose = require("mongoose");

const resolvers = {
  Query: {
    posts: async (_, __, {}) => {
      const posts = await Post.find().populate("author");
      const postsNew = posts.map((post) => ({
        id: post.id,
        ...post._doc,
        createdAt: post.createdAt.toISOString(),
      }));
      return postsNew;
    },
    getClientPosts: async (_, { email }) => {
      console.log("getClientPosts(" + email + ")");
      const posts = await Post.find().populate("author");
      //   console.log(posts?.[0]?.id);
      //   console.log(posts[0].author._id.toString());
      return posts
        .filter((post) => post.author.email === email)
        .map((post) => ({
          id: post.id,
          ...post._doc,
          createdAt: post.createdAt.toISOString(),
        }));
    },
  },
  Mutation: {
    createNewPost: async (_, { newPostInput: { content, author: email } }) => {
      let postAuthor = await Client.find();
      //   const postAuthor2 = await Client.find({ email });

      postAuthor = postAuthor.find((auhtor) => auhtor.email === email);

      if (!content.length) {
        throw new ApolloError(`Post field can't be empty!`, "EMPTY_POST_FIELD");
      }

      const post = new Post({
        content,
        author: postAuthor,
      });
      console.log("napravlje");
      const res = await post.save();

      console.log("dodana u bazu");
      return {
        id: res.id,
        ...res._doc,
      };
    },
    deletePost: async (_, { deletePost: { id } }) => {
      console.log("deleting");
      //finding by id and deleting it
      const res = await Post.deleteOne({
        _id: new mongoose.Types.ObjectId(id),
      });

      return "Successfully deleted a post!";
    },
  },
};

module.exports = resolvers;
