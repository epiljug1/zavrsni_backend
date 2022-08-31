const resolversClient = require("./client");
const resolversPosts = require("./post");

const resolvers = {
  Query: {
    ...resolversClient.Query,
    ...resolversPosts.Query,
  },
  Mutation: {
    ...resolversClient.Mutation,
    ...resolversPosts.Mutation,
  },
};

module.exports = resolvers;
