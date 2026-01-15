const pool = require("../config/db");

const DEFAULT_MEALS = [
  { id: "1", name: "Posiłek 1" },
  { id: "2", name: "Posiłek 2" },
  { id: "3", name: "Posiłek 3" },
  { id: "4", name: "Posiłek 4" }
];

const ScheduleModel = {
  parseJSONSafe(value, fallback = []) {
    if (!value) return fallback;
    if (typeof value === "string") {
      try { return JSON.parse(value); } catch { return fallback; }
    }
    if (Array.isArray(value) || typeof value === "object") return value;
    return fallback;
  },

  async ensureSchedule(userId, year, month) {
    let schedule = await this.getByMonth(userId, year, month);
    if (!schedule) {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const days = Array.from({ length: daysInMonth }, (_, i) => ({
        date: `${year}-${String(month + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`,
        meals: Object.fromEntries(DEFAULT_MEALS.map(m => [m.id, []]))
      }));

      const { rows } = await pool.query(
        `INSERT INTO monthly_schedules (user_id, year, month, kcal_limit, zero_kcal_limit, meals, days)
         VALUES ($1,$2,$3,1350,1500,$4,$5) RETURNING *`,
        [userId, year, month, JSON.stringify(DEFAULT_MEALS), JSON.stringify(days)]
      );
      schedule = rows[0];
    }

    // Jeśli istnieje rekord, ale brak meals – zainicjalizuj domyślnie
    if (!schedule.meals || schedule.meals.length === 0) schedule.meals = DEFAULT_MEALS;
    if (!schedule.days || schedule.days.length === 0) {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      schedule.days = Array.from({ length: daysInMonth }, (_, i) => ({
        date: `${year}-${String(month + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`,
        meals: Object.fromEntries(DEFAULT_MEALS.map(m => [m.id, []]))
      }));
    }

    return schedule;
  },

  async getByMonth(userId, year, month) {
    const { rows } = await pool.query(
      `SELECT * FROM monthly_schedules WHERE user_id=$1 AND year=$2 AND month=$3`,
      [userId, year, month]
    );
    const schedule = rows[0] || null;
    if (schedule) {
      schedule.meals = this.parseJSONSafe(schedule.meals);
      schedule.days = this.parseJSONSafe(schedule.days);
    }
    return schedule;
  },

  async addIngredient(userId, year, month, date, ingredient = {}) {
    // teraz destrukturyzujemy bez błędu
    let { mealId, name, weight, kcal } = ingredient;

    const schedule = await this.ensureSchedule(userId, year, month);
    const days = this.parseJSONSafe(schedule.days);

    if (!mealId) {
      mealId = schedule.meals?.[0]?.id;
      if (!mealId) throw new Error("Brak mealId do dodania składnika");
    }

    let day = days.find(d => d.date === date);
    if (!day) {
      day = { date, meals: Object.fromEntries(schedule.meals.map(m => [m.id, []])) };
      days.push(day);
    }

    if (!day.meals[mealId]) day.meals[mealId] = [];

    day.meals[mealId].push({ name, weight, kcal });

    const { rows } = await pool.query(
      `UPDATE monthly_schedules SET days=$2::jsonb, updated_at=NOW() WHERE id=$1 RETURNING *`,
      [schedule.id, JSON.stringify(days)]
    );

    const updated = rows[0];
    updated.meals = this.parseJSONSafe(updated.meals);
    updated.days = this.parseJSONSafe(updated.days);
    return updated;
  },

  async updateIngredient(userId, year, month, date, mealId, ingredientIndex, ingredient) {
    const schedule = await this.ensureSchedule(userId, year, month);
    const days = this.parseJSONSafe(schedule.days);

    const day = days.find(d => d.date === date);
    if (!day) throw new Error("Day not found");

    if (!mealId) mealId = Object.keys(day.meals)[0];
    if (!day.meals[mealId] || !day.meals[mealId][ingredientIndex])
      throw new Error("Ingredient not found");

    day.meals[mealId][ingredientIndex] = ingredient;

    const { rows } = await pool.query(
      `UPDATE monthly_schedules SET days=$2::jsonb, updated_at=NOW() WHERE id=$1 RETURNING *`,
      [schedule.id, JSON.stringify(days)]
    );
    const updated = rows[0];
    updated.meals = this.parseJSONSafe(updated.meals);
    updated.days = this.parseJSONSafe(updated.days);
    return updated;
  },

  async deleteIngredient(userId, year, month, date, mealId, ingredientIndex) {
    const schedule = await this.ensureSchedule(userId, year, month);
    const days = this.parseJSONSafe(schedule.days);

    const day = days.find(d => d.date === date);
    if (!day) throw new Error("Day not found");
    if (!mealId) mealId = Object.keys(day.meals)[0];
    if (!day.meals[mealId] || !day.meals[mealId][ingredientIndex])
      throw new Error("Ingredient not found");

    day.meals[mealId].splice(ingredientIndex, 1);

    const { rows } = await pool.query(
      `UPDATE monthly_schedules SET days=$2::jsonb, updated_at=NOW() WHERE id=$1 RETURNING *`,
      [schedule.id, JSON.stringify(days)]
    );
    const updated = rows[0];
    updated.meals = this.parseJSONSafe(updated.meals);
    updated.days = this.parseJSONSafe(updated.days);
    return updated;
  },

  async updateLimits(userId, year, month, deficitLimit, zeroLimit) {
    const schedule = await this.ensureSchedule(userId, year, month);

    const { rows } = await pool.query(
      `UPDATE monthly_schedules
     SET kcal_limit=$2,
         zero_kcal_limit=$3,
         updated_at=NOW()
     WHERE id=$1
     RETURNING *`,
      [schedule.id, deficitLimit, zeroLimit]
    );

    const updated = rows[0];
    updated.meals = this.parseJSONSafe(updated.meals);
    updated.days = this.parseJSONSafe(updated.days);
    return updated;
  },

  async updateMealName(userId, year, month, mealId, newName) {
    const schedule = await this.ensureSchedule(userId, year, month);
    const meals = this.parseJSONSafe(schedule.meals);

    // Upewnij się, że porównujemy stringi
    const meal = meals.find(m => String(m.id) === String(mealId));
    if (!meal) throw new Error("Meal not found");
    meal.name = newName;

    const { rows } = await pool.query(
      `UPDATE monthly_schedules SET meals=$2::jsonb, updated_at=NOW() WHERE id=$1 RETURNING *`,
      [schedule.id, JSON.stringify(meals)]
    );
    const updated = rows[0];
    updated.meals = this.parseJSONSafe(updated.meals);
    updated.days = this.parseJSONSafe(updated.days);
    return updated;
  },

  async addMeal(userId, year, month, name) {
    const schedule = await this.ensureSchedule(userId, year, month);
    const meals = this.parseJSONSafe(schedule.meals);
    const newMeal = { id: crypto.randomUUID(), name };
    meals.push(newMeal);

    const days = this.parseJSONSafe(schedule.days);
    days.forEach(day => {
      day.meals[newMeal.id] = [];
    });

    const { rows } = await pool.query(
      `UPDATE monthly_schedules SET meals=$2::jsonb, days=$3::jsonb, updated_at=NOW() WHERE id=$1 RETURNING *`,
      [schedule.id, JSON.stringify(meals), JSON.stringify(days)]
    );
    const updated = rows[0];
    updated.meals = this.parseJSONSafe(updated.meals);
    updated.days = this.parseJSONSafe(updated.days);
    return updated;
  },

  async deleteMeal(userId, year, month, mealId) {
    const schedule = await this.ensureSchedule(userId, year, month);
    let meals = this.parseJSONSafe(schedule.meals);
    meals = meals.filter(m => String(m.id) !== String(mealId));

    const days = this.parseJSONSafe(schedule.days);
    days.forEach(day => {
      delete day.meals[mealId];
    });

    const { rows } = await pool.query(
      `UPDATE monthly_schedules SET meals=$2::jsonb, days=$3::jsonb, updated_at=NOW() WHERE id=$1 RETURNING *`,
      [schedule.id, JSON.stringify(meals), JSON.stringify(days)]
    );

    const updated = rows[0];
    updated.meals = this.parseJSONSafe(updated.meals);
    updated.days = this.parseJSONSafe(updated.days);
    return updated;
  }
};

module.exports = ScheduleModel;