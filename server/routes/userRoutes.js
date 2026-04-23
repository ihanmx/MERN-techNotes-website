const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers");
const verifyJWT = require("../middleware/verifyJWT");
const requireRoles = require("../middleware/requireRoles");

router.use(verifyJWT);

router.route("/").get(userController.getAllUsers);

router.use(requireRoles("Manager", "Admin"));

router
  .route("/")
  .post(userController.createNewUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);
module.exports = router;
