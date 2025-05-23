import { RequestHandler } from "express";
import prisma from "../../../db";
import { errorConstructor } from "../../utils";

const createCategory: RequestHandler<
  any,
  any,
  { name: string; description: string }
> = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const image_url = req.file ? req.file.path : null;

    if (!name.length) {
      throw errorConstructor("Name is required", 400);
    }

    const isCurrentCategory = Boolean(
      await prisma.category.findFirst({
        where: {
          name,
        },
      })
    );

    if (isCurrentCategory) {
      throw errorConstructor("Category already exists", 400);
    }

    const category = await prisma.category.create({
      data: {
        name,
        description,
        image_url,
      },
    });

    res.status(201).json({
      message: "success",
      data: category,
    });
  } catch (err) {
    throw err;
  }
};

const getAllCategories: RequestHandler<
  any,
  any,
  any,
  {
    limit?: string;
    page?: string;
  }
> = async (req, res, next) => {
  try {
    const queries = req.query;

    const limit = queries.limit ? parseInt(queries.limit) : 10;
    const page = queries.page ? parseInt(queries.page) : 1;

    const categories = await prisma.category.findMany({
      take: limit,
      skip: (page - 1) * limit,
    });

    const total = await prisma.category.count();

    res.status(200).json({
      message: "success",
      data: categories,
      info: {
        limit,
        page,
        total,
      },
    });
  } catch (err) {
    throw err;
  }
};

const getCategoryById: RequestHandler<{ id?: string }> = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw errorConstructor("Id param is required!", 400);
    }

    const category = await prisma.category.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!category) {
      throw errorConstructor("Category not found", 404);
    }

    res.status(200).json({
      message: "success",
      data: category,
    });
  } catch (err) {
    throw err;
  }
};

const editCategoryById: RequestHandler<
  { id?: string },
  any,
  { name: string; description: string }
> = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { description, name } = req.body;

    const image_url = req.file ? req.file.filename : null;

    if (!id) {
      throw errorConstructor("Id param is required", 400);
    }

    if (!description.length && !name.length && !image_url) {
      throw errorConstructor("No fields to update", 400);
    }

    const category = Boolean(
      await prisma.category.findUnique({
        where: {
          id: parseInt(id),
        },
      })
    );

    if (!category) {
      throw errorConstructor("Category not found!", 404);
    }

    const recievedFields = { name, description, image_url };

    const fieldsToEdit = (
      Object.keys(recievedFields) as Array<keyof typeof recievedFields>
    ).reduce((acc, key) => {
      if (!!recievedFields[key]) {
        acc[key] = recievedFields[key];
      }
      return acc;
    }, {} as Record<keyof typeof recievedFields, string>);

    const updatedCategory = await prisma.category.update({
      where: {
        id: parseInt(id),
      },
      data: { ...fieldsToEdit },
    });

    res.status(201).json({
      message: "success",
      data: updatedCategory,
    });
  } catch (err) {
    throw err;
  }
};

const deleteCategoryById: RequestHandler<{ id?: string }> = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw errorConstructor("Id param is required!", 400);
    }

    const isCurrentCategory = Boolean(
      await prisma.category.findUnique({
        where: {
          id: parseInt(id),
        },
      })
    );

    if (!isCurrentCategory) {
      throw errorConstructor("Category not Found!", 404);
    }

    await prisma.category.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.status(200).json({
      message: "success",
    });
  } catch (err) {
    throw err;
  }
};

export {
  createCategory,
  getAllCategories,
  getCategoryById,
  editCategoryById,
  deleteCategoryById,
};
