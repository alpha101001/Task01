const express = require("express");
const router = express.Router();
const elementController = require("../Controllers/elementController.js");

// GET /divisions
router.get("/divisions", elementController.getDivisions);

// GET /districts
router.get("/districts", elementController.getDistricts);

// POST /submitSelections
router.post("/submitSelections", elementController.postSelections);

module.exports = router;
