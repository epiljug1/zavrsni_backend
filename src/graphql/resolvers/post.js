const Client = require("../../models/Client");
const Post = require("../../models/Post");
const { ApolloError } = require("apollo-server-errors");
const mongoose = require("mongoose");

const resolvers = {
  Query: {
    posts: async (_, __, {}) => {
      console.log("posts");
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
    getClientPosts: async (_, { email }) => {
      console.log("getClientPosts(" + email + ")");
      const posts = await Post.find()
        .sort({ createdAt: -1 })
        .populate("author");
      //   console.log(posts);
      //   console.log(posts?.[0]?.id);
      //   console.log(posts[0].author._id.toString());
      return posts
        .filter((post) => post?.author?.email === email)
        .map((post) => ({
          id: post.id,
          ...post._doc,
          createdAt: post.createdAt.toISOString(),
          updatedAt: post.updatedAt.toISOString(),
        }));
    },

    getPostById: async (_, { id }) => {
      console.log("get post by id: " + id);
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
      await Post.deleteOne({
        _id: new mongoose.Types.ObjectId(id),
      });

      return "Successfully deleted a post!";
    },
    editPost: async (_, { editPostInput: { id, content } }) => {
      console.log("editing post");
      if (!content.length) {
        throw new ApolloError(`Post field can't be empty!`, "EMPTY_POST_FIELD");
      }
      const post = await Post.findById({
        _id: new mongoose.Types.ObjectId(id),
      }).populate("author");
      post.content = content;

      const res = await post.save();

      console.log("ID : " + id);
      console.log("content: ", content);
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
