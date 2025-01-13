const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  userId: Number,
  userName: String,
  email: String,
  password: String, 
  role: { type: String, default: 'user' } 
});

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password); 
};

const User = mongoose.model('User', userSchema);

module.exports = User;
