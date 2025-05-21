import { ErrorMiddleware, Middleware, User } from "../types";
import jwt from "jsonwebtoken";
import { errorConstructor } from "../utils";

const errorHandlerMiddleware: ErrorMiddleware = (err, req, res, next) => {
  if (err) {
    return res.status(err.status ?? 500).json({
      message: err.message ?? "Something went wrong",
    });
  }

  next();
};

const notFoundMiddleware: Middleware = (req, res, next) => {
  return res.status(404).json({
    message: "Not found",
  });
};

const setAuthTokenMiddlewar: Middleware = (req, res, next) => {
  const token = req.headers.authorization;

  req.token = token ? token.split(" ")[1] : "";

  next();
};

const authenticationMiddleware: Middleware = (req, res, next) => {
  jwt.verify(req.token!, process.env.JWT_SECRET!, (err, payload) => {
    if (err) {
      throw errorConstructor("Unauthorized", 401);
    }

    req.user = (payload as { user: User }).user;

    next();
  });
};

export {
    errorHandlerMiddleware,
    notFoundMiddleware,
    setAuthTokenMiddlewar,
    authenticationMiddleware
}