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
  csrfPrevention: false,
  cache: "bounded",
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

cron.schedule("42 0 * * *", () => {
  //deleting all posts every day at 00:00
  console.log("deleting all posts");
  Post.deleteMany({});
});

cron.schedule("52 * * * *", () => {
  //deleting all posts every day at 00:00
  console.log("cron//");
  Post.deleteMany({}).then(() => {
    console.log("successfuly deleted");
  });
});

console.log("db: ", process.env.MONGO_DB);

mongoose
  .connect(process.env.MONGO_DB || MONGODB, { useNewUrlParser: true })
  .then(() => {
    console.log("MONGODB CONNECTED!");
    return server.listen({ port: process.env.PORT || 4000 });
  })
  .then((res) => {
    console.log("SERVER IS RUNNING AT " + res.url);
  });
