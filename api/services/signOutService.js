import { fn } from "../../lib/utils.js";
import { User } from "../../schema/user.model.js";
import jwt from "jsonwebtoken";
import { cookie_option } from "../../middlewares/gen-token.js";
import { Validation } from "../../constants/message-is-valid.js";
import { addToBlacklist } from "../../lib/blacklist.js";

export const signOut = fn(async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const cookie = req.cookies.refreshToken;
  const decoded = jwt.decode(token, { complete: true });
  const user = await User.findOne({ email: decoded.payload.email }).exec();
  if (token) addToBlacklist(token);

  user.active = false;
  user.isOnline = "offline";
  await user.save();
  if (!cookie)
    return res
      .status(400)
      .json({ status: "fail", message: Validation.already_out });
  res.clearCookie("refreshToken", {
    cookie_option,
    path: "/",
  });
  res.status(200).json({ status: "success", message: Validation.sign_out });
});
