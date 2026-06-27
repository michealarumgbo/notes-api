import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {
  BadRequestError,
  NotFoundError,
  STATUS_CODE,
  UnauthenticatedError,
  UnauthorisedError,
} from "../errors/error.js";

dotenv.config();
export const auth = (jwt_sercret = process.env.JWT_ACCESS_SECRET) => {
  return async (req, res, next) => {
    const authorization = req.get("Authorization");

    // extarct the sting
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res
        .status(STATUS_CODE.UNAUTHENTICATED)
        .json({ error: "Invalid Token" });
    }

    const token = authorization.split(" ")[1];

    // verify jwt token
    const decoded = jwt.verify(token, jwt_sercret);
    if (!decoded || !decoded.id) {
      throw UnauthorisedError("Invalid or expired token");
    }

    // add user to req body
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      throw NotFoundError("User no longer exists");
    }

    // user has to be logged in
    const isLoggedIn = await RefreshToken.findOne({
      userId: decoded.id,
    }).select("refreshToken");
    if (!isLoggedIn || !isLoggedIn.refreshToken) {
      throw UnauthorisedError("User is already logged out");
    }
    req.user = user;
    next();
  };
};
