import { User } from "../../schema/user.model.js";
import { fn } from "../../lib/utils.js";
import jwt from "jsonwebtoken";
import {
  JWT_REFRESH_TOKEN,
  JWT_ACCESS_TOKEN,
  JWT_ACCESS_TOKEN_EXPIRY,
} from "../../constants/env-local.js";
import { cookie_option } from "../../middlewares/gen-token.js";
import { Validation } from "../../constants/message-is-valid.js";
export const refresh = fn(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken)
    return res.status(401).json({ message: Validation.no_refresh });
  console.log("Refresh Token:", refreshToken);
  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_TOKEN);
    console.log("decoded", decoded);
    console.log("JWT_REFRESH_TOKEN", JWT_REFRESH_TOKEN);
    const newAccessToken = jwt.sign({ id: decoded.id }, JWT_ACCESS_TOKEN, {
      expiresIn: JWT_ACCESS_TOKEN_EXPIRY,
    });
    console.log("JWT_ACCESS_TOKEN", JWT_ACCESS_TOKEN);
    console.log("JWT_ACCESS_TOKEN_EXPIRY", JWT_ACCESS_TOKEN_EXPIRY);
    res.cookie("refreshToken", newAccessToken, cookie_option);
    return res.status(200).json({
      accessToken: newAccessToken,
      message: Validation.refresh_success,
    });
  } catch (err) {
    console.log(err);
    return res.status(403).json({ message: Validation.invalid_refresh });
  }
  // const refreshToken = req.cookies?.refreshToken;
  // if (!refreshToken) {
  //   return res.status(401).json({ message: Validation.no_refresh });
  // }
  // try {
  //   const decoded = jwt.verify(refreshToken, JWT_REFRESH_TOKEN);
  //   const newAccessToken = jwt.sign({ id: decoded.id }, JWT_ACCESS_TOKEN, {
  //     expiresIn: '10m',
  //   });
  //   // const time = new Date().toLocaleString();
  //   // const updated = `${decoded.email || decoded.id} updated at ${time} with new token.`;
  //   // console.log(updated);
  //   // res.cookie("refreshToken", newAccessToken, {
  //   //   cookie_option,
  //   // });
  //   return res.status(200).json({
  //     accessToken: newAccessToken,
  //     message: Validation.refresh_success,
  //   });
  // } catch (err) {
  //   return res.status(403).json({ message: Validation.invalid_refresh });
  // }
});
// export const refresh = fn(async (req, res) => {
//   const refreshToken = req.cookies.refreshToken;
//   if (!refreshToken)
//     return res.status(401).json({ message: "No refresh token found" });
//   jwt.verify(refreshToken, JWT_REFRESH_TOKEN, (err, decode) => {

//     if (err) return res.status(401).json({ message: Validation.expired_token });
//     const accessToken = generateAccessToken(decode);
//     res.cookie("refreshToken", accessToken, {
//       cookie_option,
//     });
//     const time = new Date().toLocaleString();
//     const updated = `${decode.email} updated at ${time} with new token.`;
//     console.log(updated);
//     res.json({ token: accessToken, message: Validation.refresh_success });
//   });
// });
