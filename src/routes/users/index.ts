import express from "express";
import {
  deleteUserById,
  editUserById,
  getUsers,
} from "../../controllers/users";

const router = express.Router();

router.get("/", getUsers);

router.put("/:id", editUserById);

router.delete("/:id", deleteUserById);

export default router;
