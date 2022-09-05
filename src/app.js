const { ApolloServer, AuthenticationError } = require("apollo-server");
const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
const mongoose = require("mongoose");
const cron = require("node-cron");
const Client = require("./models/Client");
const Post = require("./models/Post");
const MONGODB =
  "mongodb+srv://evelin:hesoyam@cluster0.x614q.mongodb.net/zavrsni?retryWrites=true&w=majority";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // csrfPrevention: true,
  // cache: 'bounded',
  context: async ({ req }) => {
    const tokenHeader = req.headers.authorization || ""; // e.g., "Bearer user-1"

    let client = null;
    if (tokenHeader) {
      const token = tokenHeader.split(" ")[1];
      client = await Client.findOne({ token });
    }

    return client ? { client } : null;
  },
});

cron.schedule("0 0 * * *", async () => {
  //deleting all posts every day at 00:00
  await Post.deleteMany({});
});

mongoose
  .connect(MONGODB, { useNewUrlParser: true })
  .then(() => {
    console.log("MONGODB CONNECTED!");
    return server.listen({ port: 4000 });
  })
  .then((res) => {
    console.log("SERVER IS RUNNING AT " + res.url);
  });
