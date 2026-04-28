import { Router } from "express";
import {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
} from "../controllers/userControllers.js";
import verifyJWT from "../middlewares/verifyJWT.js";
import requireRoles from "../middlewares/requireRoles.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getAllUsers);

router.use(requireRoles("Manager", "Admin"));

router.route("/").post(createNewUser).patch(updateUser).delete(deleteUser);

export default router;
