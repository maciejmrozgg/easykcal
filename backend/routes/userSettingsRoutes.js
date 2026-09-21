const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const userSettingsValidation = require("../middleware/userSettingsValidation");
const controller = require("../controllers/userSettingsController");

router.use(authMiddleware);

router.get("/",controller.getUserSettings);
router.patch("/", userSettingsValidation, controller.updateUserSettings);

module.exports = router;