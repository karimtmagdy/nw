
// @route   GET api/v1/users/me
// @desc    Get current user
// @access  Private
exports.me = fn(async (req, res, next) => {
  console.log(req.user); // user is populated from auth middleware in userRoutes.js, see userRoutes.js for details
  res.json(req.user);
});
