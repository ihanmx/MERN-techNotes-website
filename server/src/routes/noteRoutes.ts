import { Router } from "express";
import {
  getAllNotes,
  createNewNote,
  updateNote,
  deleteNote,
} from "../controllers/noteControllers.js";
import verifyJWT from "../middlewares/verifyJWT.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/")
  .get(getAllNotes)
  .post(createNewNote)
  .patch(updateNote)
  .delete(deleteNote);

export default router;
