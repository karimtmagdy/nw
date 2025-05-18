import jwt from "jsonwebtoken";
import { User } from "../schema/user.model.js";
import { JWT_ACCESS_TOKEN } from "../constants/env-local.js";
import { Validation } from "../constants/message-is-valid.js";
// import { isBlacklisted } from "../lib/blacklist.js";

// check if token valid ✅
export const JWTauth = async (req, res, next) => {
  const auth = req.headers.authorization;
  const token = auth && auth.split(" ")[1];
  if (!token)
    return res.status(401).json({
      message: Validation.unauthorized,
    });
  try {
    jwt.verify(token, JWT_ACCESS_TOKEN, async (err, decode) => {
      if (err)
        return res.status(401).json({ message: Validation.expired_token });
      const user = await User.findById({ _id: decode.id });
      if (!user)
        res.status(404).json({ message: "access denied not available!" });
      req.user = decode;
      next();
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: Validation.expired_token });
  }
};
// check if user have role (Admin) ✅
export const isAdmin = (req, res, next) => {
  JWTauth(req, res, () => {
    const allowedRoles = ["admin", "manager", "moderator"];
    if (!allowedRoles.includes(req.user.role))
      return res.status(403).json({ message: Validation.forbidden });
    next();
  });
};

// check private route just need to valid token ✅
export const privateRoute = async (req, res, next) => {
  await JWTauth(req, res, async () => {
    try {
      const user = await User.findById(req.user.id);
      if (!user)
        return res.status(404).json({ message: "user not found private" });
      req.user = user;
      next();
    } catch (error) {
      // console.log(error);
      return res.status(401).json({ message: "Unauthorized access! private" });
    }
  });
};

// protected routes important ✅
export const protectedRoute = async (req, res, next) => {
  await privateRoute(req, res, async () => {
    if (!req.user.active) {
      console.log("first", req.user.active);
      return res.status(403).json({ message: "Your account is not active." });
    }
    // if (!req.user.verified) { ... }
    next();
  });
};
