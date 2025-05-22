import { RequestHandler } from "express";
import prisma from "../../../db";
import { errorConstructor } from "../../utils";
import bcrypt from 'bcrypt'

const getUsers: RequestHandler<
  any,
  any,
  any,
  { id?: string; email?: string }
> = async (req, res, next) => {
  try {
    const queries = req.query;

    const filters = {
      ...queries,
      id: queries.id ? parseInt(queries.id) : undefined,
    };

    const users = await prisma.user.findMany({
      where: filters,
    });

    res.status(200).json({
      message: "success",
      data: users,
    });
  } catch (err) {
    throw err;
  }
};

const deleteUserById: RequestHandler<{ id?: string }> = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw errorConstructor("Param is required", 400);
    }

    const isCurrentUser = Boolean(
      await prisma.user.findUnique({
        where: {
          id: parseInt(id),
        },
      })
    );

    if (!isCurrentUser) {
      throw errorConstructor("User not found", 404);
    }

    const user = await prisma.user.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.status(200).json({
      message: "success",
      data: user,
    });
  } catch (err) {
    throw err;
  }
};

const editUserById: RequestHandler<
  { id?: string },
  any,
  {
    email?: string;
    password?: string;
  }
> = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email, password } = req.body;

    if (!id) {
      throw errorConstructor("Params is required", 400);
    }

    if (!email && !password) {
      throw errorConstructor("No fields to update", 400);
    }

    const isCurrentUser = Boolean(
      await prisma.user.findUnique({
        where: {
          id: parseInt(id),
        },
      })
    );

    if (!isCurrentUser) {
      throw errorConstructor("User not found", 404);
    }

    const modifiedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    const updatedUser = await prisma.user.update({
      where: {
        id: parseInt(id),
      },
      data: {
        email,
        password: modifiedPassword,
      },
    })

    res.status(200).json({
      message: "success",
      data: updatedUser,
    });
  } catch (err) {
    throw err;
  }
};

export { getUsers, deleteUserById, editUserById };
