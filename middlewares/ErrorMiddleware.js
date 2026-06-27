import z, { ZodError } from "zod";
import jwt from "jsonwebtoken";
import { Base_error, STATUS_CODE } from "../errors/error.js";

export const errorMiddleware = async (err, req, res, next) => {
  const errMsg = err.message;
  const status = err.status;

  if (err instanceof Base_error) {
    res.status(status).json({ error: errMsg });
  } else if (
    err instanceof jwt.JsonWebTokenError ||
    err instanceof jwt.TokenExpiredError
  ) {
    res
      .status(STATUS_CODE.UNAUTHORISED)
      .json({ error: "Invalid or expired token" });
  } else if (err instanceof ZodError) {
    const errors = z.flattenError(err);
    let error =
      errors.formErrors.length != 0 ? errors.formErrors : errors.fieldErrors;

    error = Object.values(error)
      .map((e) => e[0])
      .join(", ");

    res.status(STATUS_CODE.BAD_REQUEST).json({ error });
  } else {
    console.log(err);
    res.status(STATUS_CODE.SERVERERROR).json({ error: "Something went wrong" });
  }
};
