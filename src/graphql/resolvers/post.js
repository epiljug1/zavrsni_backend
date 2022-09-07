const Client = require("../../models/Client");
const Post = require("../../models/Post");
const { ApolloError } = require("apollo-server-errors");
const mongoose = require("mongoose");

const resolvers = {
  Query: {
    posts: async (_, __, {}) => {
      const posts = await Post.find()
        .sort({ createdAt: -1 })
        .populate("author");

      const postsNew = posts.map((post) => ({
        id: post.id,
        ...post._doc,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
      }));
      return postsNew;
    },
    getClientPosts: async (_, { email }, { client }) => {
      if (!client) {
        return null;
      }
      const posts = await Post.find()
        .sort({ createdAt: -1 })
        .populate("author");

      return posts
        .filter((post) => post?.author?.email === email)
        .map((post) => ({
          id: post.id,
          ...post._doc,
          createdAt: post.createdAt.toISOString(),
          updatedAt: post.updatedAt.toISOString(),
        }));
    },

    getPostById: async (_, { id }, { client }) => {
      if (!client) {
        return null;
      }
      const post = await Post.findById({
        _id: new mongoose.Types.ObjectId(id),
      }).populate("author");

      return {
        id: post.id,
        ...post._doc,
      };
    },
  },
  Mutation: {
    createNewPost: async (
      _,
      { newPostInput: { content, author: email } },
      { client }
    ) => {
      if (!client) {
        return null;
      }
      let postAuthor = await Client.findOne({ email });

      if (!content.length) {
        throw new ApolloError(`Post field can't be empty!`, "EMPTY_POST_FIELD");
      }

      const post = new Post({
        content,
        author: postAuthor,
      });
      const res = await post.save();

      return {
        id: res.id,
        ...res._doc,
      };
    },
    deletePost: async (_, { deletePost: { id } }, { client }) => {
      if (!client) {
        return null;
      }
      //finding by id and deleting it
      await Post.deleteOne({
        _id: new mongoose.Types.ObjectId(id),
      });

      return "Successfully deleted a post!";
    },
    editPost: async (_, { editPostInput: { id, content } }, client) => {
      if (!client) {
        return null;
      }
      if (!content.length) {
        throw new ApolloError(`Post field can't be empty!`, "EMPTY_POST_FIELD");
      }
      const post = await Post.findById({
        _id: new mongoose.Types.ObjectId(id),
      }).populate("author");
      post.content = content;

      const res = await post.save();

      return {
        id: res.id,
        ...res._doc,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
      };
    },
  },
};

module.exports = resolvers;
