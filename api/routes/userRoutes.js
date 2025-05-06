const express = require("express");
const router = express.Router();
const {
  deleteUser,
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
} = require("../services/user.service");
const {
  deleteMe,
  updateMe,
  getMe,
} = require("../services/userActions.service");
const { isAdmin, authorize } = require("../middleware/auth");

router.use([authorize]);

router.route("/me").get(getMe).patch(updateMe).delete(deleteMe);
router.route("/").get([isAdmin], getAllUsers).post([isAdmin], createUser);
router
  .route("/:id")
  .get([isAdmin], getSingleUser)
  .patch([isAdmin], updateUser)
  .delete([isAdmin], deleteUser);

module.exports = router;

// // Create JWT token
// const payload = {
//   user: {
//     id: user.id,
//     role: user.role,
//   },
// };

// jwt.sign(
//   payload,
//   process.env.JWT_SECRET || "jwtSecret",
//   { expiresIn: "24h" },
//   (err, token) => {
//     if (err) throw err;
//     res.json({ token });
//   }
// );
