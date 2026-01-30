const express = require("express");
const workshopController = require("../controllers/workshopController");

const router = express.Router();

router.post("/workshop-register", workshopController.registerWorkshop);

module.exports = router;
