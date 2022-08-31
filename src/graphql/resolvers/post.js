const Client = require("../../models/Client");
const Post = require("../../models/Post");

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
      //   console.log(posts.filter((post) => post.author._id === id));
      //   console.log(posts);
      //   console.log(posts[0].author._id.toString());
      return posts.filter((post) => post.author.email === email);
    },
  },
  Mutation: {
    createNewPost: async (_, { newPostInput: { content, author: email } }) => {
      let postAuthor = await Client.find();
      //   const postAuthor2 = await Client.find({ email });

      postAuthor = postAuthor.find((auhtor) => auhtor.email === email);

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
  },
};

module.exports = resolvers;
