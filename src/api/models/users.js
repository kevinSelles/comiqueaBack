const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const listSchema = new mongoose.Schema({
  name: { type: String, required: true },
  comics: [{ type: mongoose.Types.ObjectId, ref: "comics" }],
});

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ 
    },
    rol: { 
      type: String, 
      required: true, 
      enum: ["admin", "user"], 
      default: "user" 
    },
    favorites: [{ type: mongoose.Types.ObjectId, ref: "comics" }],
    owned: [{ type: mongoose.Types.ObjectId, ref: "comics" }],
    read: [{ type: mongoose.Types.ObjectId, ref: "comics" }],
    wishlist: [{ type: mongoose.Types.ObjectId, ref: "comics" }],
    customLists: [listSchema],
    createdComics: [{ type: mongoose.Types.ObjectId, ref: "comics" }],
    comments: [{ type: mongoose.Types.ObjectId, ref: "comments" }]
  },
  {
    timestamps: true,
    collection: "users",
  }
);

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password, 10);
  }
  next();
});

const User = mongoose.model("users", userSchema, "users");
module.exports = User;