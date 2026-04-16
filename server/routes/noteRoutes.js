const express = require("express");
const router = express.Router();
const noteController = require("../controllers/noteControllers");

router.route("/").get().post().patch().delete();

module.exports = router;
