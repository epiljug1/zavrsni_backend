const { gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    clients: [Client!]
    posts: [Post!]
    getClientByUsername(username: String): Client
    getClientPosts(email: String!): [Post!]
    getPostById(id: String): Post
  }

  type Mutation {
    signUpClient(createClientInput: CreateClientInput): Client
    signInClient(signinInput: SigninInput): Client
    createNewPost(newPostInput: NewPostInput): Post
    deletePost(deletePost: DeletePostInput!): String
    editPost(editPostInput: EditPostInput): Post
  }

  type Client {
    name: String!
    surname: String!
    username: String!
    email: String!
    password: String!
    token: String!
  }

  type Post {
    id: ID
    content: String!
    author: Client
    createdAt: String!
    updatedAt: String!
  }

  input EditPostInput {
    content: String
    id: String
  }

  input NewPostInput {
    content: String
    author: String
  }

  input DeletePostInput {
    id: String
  }

  input CreateClientInput {
    name: String
    surname: String
    username: String
    email: String
    password: String
  }

  input SigninInput {
    username: String
    password: String
  }
`;

module.exports = typeDefs;
