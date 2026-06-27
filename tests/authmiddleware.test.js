import { auth } from "../middlewares/AuthMiddleware.js";
import { test, describe, it, expect, vi, beforeEach } from "vitest";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";

beforeEach(() => {
  vi.clearAllMocks();
});

// mocking modules
vi.mock("jsonwebtoken");

vi.mock("../models/RefreshToken.js", () => ({
  default: {
    findOne: vi.fn(),
  },
}));
vi.mock("../models/User.js", () => ({
  default: {
    findById: vi.fn(),
  },
}));

// creating fake express object
const mockReq = {
  get: vi.fn(),
};
const mockRes = {
  status: vi.fn().mockReturnThis(), // mockReturnThis() allows chaining
  json: vi.fn(),
};

const next = vi.fn();

it("should return 403 when no token is provided", async () => {
  mockReq.get.mockReturnValue(undefined);
  const middleware = auth();
  await middleware(mockReq, mockRes, next);
  expect(mockRes.status).toHaveBeenCalledWith(403);
  expect(mockRes.json).toHaveBeenCalledWith({
    error: "Invalid Token",
  });

  expect(next).not.toHaveBeenCalled();
});

it("should return 403 for invalid bearer token format", async () => {
  mockReq.get.mockReturnValue("InvalidToken");

  const middleware = auth();

  await middleware(mockReq, mockRes, next);

  expect(mockRes.status).toHaveBeenCalledWith(403);

  expect(mockRes.json).toHaveBeenCalledWith({
    error: "Invalid Token",
  });
  expect(next).not.toHaveBeenCalled();
});

it("should attach user and call next", async () => {
  mockReq.get.mockReturnValue("Bearer validtoken");

  jwt.verify.mockReturnValue({ id: "123" });

  User.findById.mockReturnValue({
    select: vi.fn().mockResolvedValue({
      _id: "123",
      name: "John",
    }),
  });

  RefreshToken.findOne.mockReturnValue({
    select: vi.fn().mockResolvedValue({
      refreshToken: "abc123",
    }),
  });

  const middleware = auth();
  await middleware(mockReq, mockRes, next);

  expect(next).toHaveBeenCalled();
  expect(mockReq.user).toEqual({
    _id: "123",
    name: "John",
  });
});
