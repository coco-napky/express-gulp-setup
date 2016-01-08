"use strict";
let mongoose = require('mongoose');
let schema = mongoose.Schema;

let userSchema = new mongoose.Schema({
  name : String,
  username : { type: String, required : true, unique : true },
  password : { type: String, required : true },
  admin    : Boolean,
  created_at : Date
});

let User = mongoose.model('User', userSchema);

module.exports = User;
