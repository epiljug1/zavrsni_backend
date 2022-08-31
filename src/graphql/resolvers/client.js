const Client = require("../../models/Client");
const { ApolloError } = require("apollo-server-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// svaki resolver (parent ->useful with resolver chains, args-> arguments for field, context -> auth, db conn, info) => {}

const resolvers = {
  Query: {
    clients: async (_, __, { client }) => {
      console.log("CLIENTSSS");
      // console.log(!!client);
      // console.log(client);
      const clients = await Client.find();
      const clinetsNew = clients.map((client) => ({
        id: client.id,
        ...client._doc,
      }));
      return clinetsNew;
    },
    getClientByUsername: async (_, { username }, { field }) => {
      console.log("field: " + field);
      const user = await Client.findOne({ username });
      console.log("USER------\n" + user._id);

      return {
        id: user.id,
        ...user._doc,
      };
    },
  },
  Mutation: {
    async signUpClient(
      _,
      { createClientInput: { name, surname, username, email, password } }
    ) {
      console.log("register user");

      //see if same user exist
      const oldClient = await Client.findOne({ username });

      //ako postoji baciti error
      if (oldClient) {
        console.log("error 42");
        throw new ApolloError(
          "There is already client with this data",
          "USER_EXISTS"
        );
      }

      //encrypting password
      const encryptedPass = await bcrypt.hash(password, 10);

      //making new instance of model
      const newClient = new Client({
        name,
        surname,
        username,
        email: email.toLowerCase(),
        password: encryptedPass,
      });

      //onda pravimo jwt
      const token = jwt.sign(
        { user_id: newClient._id, email },
        "somesecretstring",
        {
          expiresIn: "2h",
        }
      );
      // console.log("token: " + token);

      newClient.token = token;

      //sejvamo usera u db
      const res = await newClient.save();
      console.log("SUCCESFULLY CREATED A NEW USER");

      return {
        id: res.id,
        ...res._doc,
      };
    },
    signInClient: async (_, { signinInput: { username, password } }) => {
      //prvo gledamo ima li usera
      console.log("---signinClient---");
      const checkClient = await Client.findOne({ username });

      //ako nema bacamo error
      if (!checkClient) {
        throw new ApolloError(
          "There is no client with this data",
          "USER_DOES_NOT_EXISTS"
        );
      }

      //provjera passworda je li dobar
      const isEqualPassword = await bcrypt.compare(
        password,
        checkClient.password
      );

      if (!isEqualPassword) {
        throw new ApolloError("Incorrect password!", "INCORRECT_PASSWORD");
      }

      //pravimo novi token
      checkClient.token = jwt.sign(
        { user_id: checkClient._id, email: checkClient.email },
        "somesecretstring",
        {
          expiresIn: "2h",
        }
      );

      await checkClient.save();

      console.log("signin success!");

      return {
        id: checkClient.id,
        ...checkClient._doc,
      };
    },
  },
};

module.exports = resolvers;
