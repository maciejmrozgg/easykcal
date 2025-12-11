const ScheduleModel = require("../models/scheduleModel");

exports.getSchedule = async (req, res) => {
    try {
        const userId = req.user.id;
        const schedule = await ScheduleModel.getAllByUser(userId);
        res.json(schedule);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch schedule" });
    }
};

exports.createScheduleItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { dayOfWeek, mealName, recipeId } = req.body;

        if (!dayOfWeek || !mealName) {
            return res.status(400).json({ error: "Missing fields" });
        }

        const item = await ScheduleModel.create(userId, dayOfWeek, mealName, recipeId);
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ error: "Failed to create schedule item" });
    }
};

exports.deleteScheduleItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const id = req.params.id;

        const deleted = await ScheduleModel.delete(id, userId);
        if (!deleted) {
            return res.status(404).json({ error: "Schedule item not found" });
        }

        res.json({ message: "Schedule item deleted" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete schedule item" });
    }
};