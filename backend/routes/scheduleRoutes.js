const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const scheduleController = require("../controllers/scheduleController");

router.get("/", authMiddleware, scheduleController.getSchedule);
router.post("/", authMiddleware, scheduleController.createScheduleItem);
router.delete("/:id", authMiddleware, scheduleController.deleteScheduleItem);

module.exports = router;