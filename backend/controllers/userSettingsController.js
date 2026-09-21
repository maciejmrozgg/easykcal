const UserSettingsModel = require("../models/userModel");

exports.getUserSettings = async(req, res) => {
    try {
        const userId = req.user.id;

        const userSettings = await UserSettingsModel.getByUserId(userId);
        res.json(userSettings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch user settings" });
    }
}

exports.updateUserSettings = async(req, res) => {
    try {
        const userId = req.user.id;

        const settings = req.body;
        const userSettings = await UserSettingsModel.updateUserSettings(userId, settings);
        res.json(userSettings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update user settings" });
    }
}