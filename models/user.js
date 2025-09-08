const mongoose = require("mongoose"); //require mongoose

const userSchema = new mongoose.Schema({ //define model
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema); //register the model

module.exports = User; //export the model