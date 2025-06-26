module.exports = (req, res, next) => {
  if (!req.user.emailVerified) {
    return res.status(403).json({ msg: 'Email not verified' });
  }
  next();
};
