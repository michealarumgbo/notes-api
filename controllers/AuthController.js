import User from "../models/User.js";
import { registerSchema } from "../validations/RegisterSchema.js";
import { loginSchema } from "../validations/LoginSchema.js";
import {
  NotFoundError,
  BadRequestError,
  STATUS_CODE,
} from "../errors/error.js";
import z from "zod";
import bcrypt from "bcrypt";
import RefreshToken from "../models/RefreshToken.js";
import { newAccessToken, newRefreshToken } from "../utils/functions.js";

// register user
export const registerUser = async (req, res) => {
  const { name, email, password } = registerSchema.parse(req.body);

  //   check is email already exists
  const emailExist = await User.findOne({ email });
  if (emailExist) {
    throw new BadRequestError("User already exists!");
  }

  //   hash password
  const hashedPassword = await bcrypt.hash(password, 13);

  //   store user
  const user = new User({
    name,
    email,
    password: hashedPassword,
  });

  //   get user tokens
  const access_token = newAccessToken({ _id: user._id, email: user.email });
  const refresh_token = newRefreshToken({ _id: user._id, email: user.email });

  const refreshToken = new RefreshToken({
    userId: user._id,
    refreshToken: refresh_token,
  });
  await user.save();
  await refreshToken.save();

  //   remove password from response
  const { password: pwd, ...userData } = user._doc;

  //   return response
  res.status(STATUS_CODE.CREATED).json({
    message: "User Registered Successfully",
    user: userData,
    access_token,
    refresh_token,
  });
};
// login user
export const loginUser = async (req, res) => {
  // extract user data
  const { email, password } = loginSchema.parse(req.body);

  //   check if user exists
  const userExists = await User.findOne({ email });
  if (!userExists) {
    throw new NotFoundError("Invalid Email or Password");
  }

  // check if password match
  const passwordMatch = await bcrypt.compare(password, userExists.password);

  if (!passwordMatch) {
    throw new NotFoundError("Invalid Email or Password");
  }

  //   get user tokens
  const access_token = newAccessToken({ _id: user._id, email: user.email });
  const refresh_token = newRefreshToken({ _id: user._id, email: user.email });

  //   update user refresh token
  await RefreshToken.updateOne(
    { userId: userExists._id },
    { refreshToken: refresh_token },
  );

  //   remove password from response
  const { password: pwd, ...userData } = userExists._doc;

  //   return response
  res.status(STATUS_CODE.SUCCESS).json({
    message: "User Logged In Successfully",
    user: userData,
    access_token,
    refresh_token,
  });
};
// get new token(access)
export const newToken = async (req, res) => {
  const user = req.user;

  //   generate new access token
  const access_token = newAccessToken({ _id: user._id, email: user.email });
  res.status(STATUS_CODE.SUCCESS).json({
    message: "Token Retrieved Successfully",
    access_token,
  });
};
// logout
export const logoutUser = async (req, res) => {
  const user = req.user;

  //   update refresh token
  await RefreshToken.updateOne({ userId: user._id }, { refreshToken: "" });
  res.status(STATUS_CODE.SUCCESS).json({
    message: "Logged out Successfully",
  });
};
