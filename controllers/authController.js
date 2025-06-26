const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/email');

exports.register = async (req, res) => {

  const { name, email, password } = req.body;
  try {
    if (await User.findOne({ email }))
      return res.status(400).json({ msg: 'User already exists' });

    const user = new User({ name, email, password: await bcrypt.hash(password, 10) });

    // Create verification token
    user.emailVerificationToken = crypto.randomBytes(20).toString('hex');
    user.emailVerificationTokenExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send verification email
    const verifyUrl = `${req.protocol}://${req.get('host')}/api/auth/verify/${user.emailVerificationToken}`;
    await sendEmail(email, 'Verify your account',
      `<p>Please verify your email by clicking <a href="${verifyUrl}">here</a>.</p>`);

    res.json({ msg: 'Registration successful. Check your email to verify account.' });
  } catch (e) {
    res.status(500).send('Server error');
  }
};


exports.verifyEmail = async (req, res) => {
  const user = await User.findOne({
    emailVerificationToken: req.params.token,
    emailVerificationTokenExpires: { $gt: Date.now() },
  });
  if (!user) return res.status(400).send('Invalid or expired token.');
  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationTokenExpires = undefined;
  await user.save();
  res.send('Email verified! You can now log in.');
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ msg: 'Invalid credentials' });
  if (!user.emailVerified) return res.status(401).json({ msg: 'Email not verified' });

  const token = jwt.sign({ id: user._id, emailVerified: user.emailVerified }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
};

exports.forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ msg: 'No user with that email' });

  user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save();

  const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset/${user.resetPasswordToken}`;
  await sendEmail(user.email, 'Password reset request',
    `<p>Click <a href="${resetUrl}">here</a> to reset your password. If you didn’t request this, please ignore.</p>`);

  res.json({ msg: 'Password reset link sent to email.' });
};

exports.resetPassword = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) return res.status(400).json({ msg: 'Invalid or expired token' });

  user.password = await bcrypt.hash(req.body.password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ msg: 'Password has been reset.' });
};
