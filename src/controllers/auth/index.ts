import { RequestHandler } from "express";
import { errorConstructor } from "../../utils";
import prisma from "../../../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

const register: RequestHandler<
  any,
  any,
  { email?: string; password?: string, name?: string }
> = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      throw errorConstructor("All fields are required", 400);
    }

    const isCurrentUser = Boolean(
      await prisma.user.findUnique({
        where: {
          email,
        },
      })
    );

    if (isCurrentUser) {
      throw errorConstructor("Email already exists", 400);
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        password: encryptedPassword,
        email,
      },
    });

    res.status(201).json({
      message: "success",
      data: user,
    });
  } catch (err) {
    throw err;
  }
};

const login: RequestHandler<
  any,
  any,
  { email?: string; password?: string }
> = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw errorConstructor("All fields are required", 400);
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw errorConstructor("Invalid credentials", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw errorConstructor("Invalid credentials", 401);
    }

    const token = jwt.sign({ user }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "success", data: { token } });
  } catch (err) {
    throw err;
  }
};

export { register, login };
