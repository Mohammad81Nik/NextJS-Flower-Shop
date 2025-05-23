import express from "express";
import {
  createCategory,
  deleteCategoryById,
  editCategoryById,
  getAllCategories,
  getCategoryById,
} from "../../controllers/categories";
import upload from "../../utils/multer/multerConfig";

const router = express.Router();

router.post("/", upload.single("image"), createCategory);

router.get("/", getAllCategories);

router.get("/:id", getCategoryById);

router.put("/:id", upload.single("image"), editCategoryById);

router.delete("/:id", deleteCategoryById);

export default router;
