const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: String,
  emailVerificationTokenExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});
module.exports = mongoose.model('User', UserSchema);
