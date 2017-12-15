const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator");
const md5 = require("md5");
const uuid = require("uuid/v4");

const UserSchema = new Schema(
  {
    //...
    email: {
      type: String,
      required: true,
      unique: true
    },

    fname: {
      type: String,
      required: true
    },

    lname: {
      type: String,
      required: true
    },

    passwordHash: {type: String, required: true},

    token: {type: String, unique: true}
  },
  {
    timestamps: true
  }
);

UserSchema.plugin(uniqueValidator);

UserSchema.pre("save", function(next) {
  this.token = md5(`${this.email}${uuid()}`);
  next();
});

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

UserSchema.virtual("password")
  .get(function() {
    return this._password;
  })
  .set(function(value) {
    this._password = value;
    this.passwordHash = bcrypt.hashSync(value, 8);
  });

const User = mongoose.model("User", UserSchema);

module.exports = User;
