const { ApolloServer, AuthenticationError } = require("apollo-server");
const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
const mongoose = require("mongoose");
const Client = require("./models/Client");
const Post = require("./models/Post");
const MONGODB =
  "mongodb+srv://evelin:hesoyam@cluster0.x614q.mongodb.net/zavrsni?retryWrites=true&w=majority";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // csrfPrevention: true,
  // cache: 'bounded',
  // context: async ({ req }) => {
  //   console.log("evo context", req);
  //   console.log(counter++);
  //   const tokenHeader = req.headers.authorization || ""; // e.g., "Bearer user-1"
  //   console.log("token->" + tokenHeader);
  //   const token = tokenHeader.split(" ")[1]; // e.g., "user-1"

  //   const client = await Client.findOne({ token });

  //   if (!client)
  //     throw new AuthenticationError(
  //       "you must be logged in to query this schema"
  //     );

  //   console.log(">" + client + "<");

  //   return { client };
  // },
});

mongoose
  .connect(MONGODB, { useNewUrlParser: true })
  // .then(() => {
  //   console.log("MONGODB CONNECTED!");
  //   return Client.find();
  // })
  // .then((data) => {
  //   console.log(data[4]);
  //   const newPost = new Post({
  //     content:
  //       "Now that  After this section, we recommend moving on to:",
  //     author: data[4],
  //   });

  //   return newPost.save();
  // })
  .then(() => {
    // console.log("eto sejvana je post");
    console.log("MONGODB CONNECTED!");
    return server.listen({ port: 4000 });
  })
  .then((res) => {
    console.log("SERVER IS RUNNING AT " + res.url);
  });
