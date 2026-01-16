const ScheduleModel = require("../models/scheduleModel");

// GET full month
exports.getMonthlySchedule = async (req, res) => {
    try {
        const userId = req.user.id;
        const { year, month } = req.params;

        const schedule = await ScheduleModel.ensureSchedule(userId, Number(year), Number(month));
        res.json(schedule);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch monthly schedule" });
    }
};

// PATCH monthly kcal limit
exports.updateMonthlyLimits = async (req, res) => {
    try {
        const userId = req.user.id;
        const { year, month } = req.params;
        const { deficitLimit, zeroLimit } = req.body;

        if (
            deficitLimit == null ||
            zeroLimit == null ||
            deficitLimit < 0 ||
            zeroLimit < deficitLimit
        ) {
            return res.status(400).json({ error: "Invalid limits" });
        }

        const schedule = await ScheduleModel.updateLimits(
            userId,
            Number(year),
            Number(month),
            deficitLimit,
            zeroLimit
        );

        res.json(schedule);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update limits" });
    }
};

// Meals CRUD
exports.addMeal = async (req, res) => {
    try {
        const userId = req.user.id;
        const { year, month } = req.params;
        const { name } = req.body;

        if (!name) return res.status(400).json({ error: "Meal name required" });

        const schedule = await ScheduleModel.addMeal(userId, Number(year), Number(month), name);
        res.json(schedule);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add meal" });
    }
};

exports.updateMealName = async (req, res) => {
    try {
        const userId = req.user.id;
        const { year, month, mealId } = req.params;
        const { name } = req.body;

        if (!name) return res.status(400).json({ error: "Meal name required" });

        const schedule = await ScheduleModel.updateMealName(userId, Number(year), Number(month), mealId, name);
        res.json(schedule);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update meal name" });
    }
};

exports.deleteMeal = async (req, res) => {
    try {
        const userId = req.user.id;
        const { year, month, mealId } = req.params;

        const schedule = await ScheduleModel.deleteMeal(
            userId,
            Number(year),
            Number(month),
            mealId
        );

        res.json(schedule);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete meal" });
    }
};

// Ingredients CRUD
exports.addIngredient = async (req, res) => {
    try {
        const userId = req.user.id;
        const { year, month, date } = req.params; // <-- data z URL
        const { mealId, name, weight, kcal } = req.body;

        if (!name || weight == null || kcal == null)
            return res.status(400).json({ error: "Invalid ingredient" });

        const schedule = await ScheduleModel.addIngredient(
            userId,
            Number(year),
            Number(month),
            date,
            { mealId, name, weight, kcal }
        );

        res.json(schedule);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add ingredient" });
    }
};

exports.updateIngredient = async (req, res) => {
    try {
        const userId = req.user.id;
        const { year, month, date, ingredientIndex } = req.params;
        const ingredient = req.body;

        if (!ingredient?.name || ingredient.weight == null || ingredient.kcal == null)
            return res.status(400).json({ error: "Invalid ingredient" });

        const schedule = await ScheduleModel.updateIngredient(
            userId,
            Number(year),
            Number(month),
            date,              // <-- używamy daty
            ingredient.mealId, // mealId w body
            Number(ingredientIndex),
            ingredient
        );

        res.json(schedule);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update ingredient" });
    }
};

exports.deleteIngredient = async (req, res) => {
    try {
        const userId = req.user.id;
        const { year, month, date, ingredientIndex } = req.params;

        const { mealId } = req.body;
        const schedule = await ScheduleModel.deleteIngredient(
            userId,
            Number(year),
            Number(month),
            date,
            mealId,
            Number(ingredientIndex)
        );


        res.json(schedule);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete ingredient" });
    }
};