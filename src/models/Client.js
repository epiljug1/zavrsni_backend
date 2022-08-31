const { model, Schema, mongoose} = require("mongoose");

const clientSchema = new Schema({
    name: String,
    surname: String,
    username: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
    },
    password: String,
    token: String
});

module.exports = model("Client", clientSchema);