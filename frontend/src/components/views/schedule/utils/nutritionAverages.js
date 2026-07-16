/* ===== MEAL TOTALS ===== */
export const getMealTotals = (ingredients) => {
    if (!Array.isArray(ingredients)) return { kcal: 0, weight: 0, protein: 0, fat: 0, carbs: 0 };
    return ingredients.reduce(
        (acc, i) => ({
            kcal: acc.kcal + (i.kcal || 0),
            weight: acc.weight + (i.weight || 0),
            protein: acc.protein + (i.protein || 0),
            fat: acc.fat + (i.fat || 0),
            carbs: acc.carbs + (i.carbs || 0)
        }),
        { kcal: 0, weight: 0, protein: 0, fat: 0, carbs: 0 }
    );
};

/* ===== DAY TOTALS ===== */
export const getDayTotals = (day) => {
    if (!day?.meals) return { kcal: 0, weight: 0, protein: 0, fat: 0, carbs: 0 };
    return Object.values(day.meals).reduce(
        (acc, meal) => {
            if (!Array.isArray(meal)) return acc;
            meal.forEach(i => {
                acc.kcal += i.kcal || 0;
                acc.weight += i.weight || 0;
                acc.protein += i.protein || 0;
                acc.fat += i.fat || 0;
                acc.carbs += i.carbs || 0;
            });
            return acc;
        },
        { kcal: 0, weight: 0, protein: 0, fat: 0, carbs: 0 }
    );
};

/***** MONTHLY AVERAGES *****/
export const getMonthlyAverages = (days) => {
    const filledDays = days.filter(day => {
        const totals = getDayTotals(day);
        return totals.kcal > 0;
    });

    if (filledDays.length === 0) {
        return {
            averages: {
                kcal: 0,
                weight: 0,
                protein: 0,
                fat: 0,
                carbs: 0
            },
            days: []
        };
    }

    const totals = filledDays.reduce(
        (acc, day) => {
            const dayTotals = getDayTotals(day);

            acc.kcal += dayTotals.kcal;
            acc.weight += dayTotals.weight;
            acc.protein += dayTotals.protein;
            acc.fat += dayTotals.fat;
            acc.carbs += dayTotals.carbs;

            return acc;
        },
        { kcal: 0, weight: 0, protein: 0, fat: 0, carbs: 0 }
    );

    const averages = {
        kcal: totals.kcal / filledDays.length,
        weight: totals.weight / filledDays.length,
        protein: totals.protein / filledDays.length,
        fat: totals.fat / filledDays.length,
        carbs: totals.carbs / filledDays.length
    };

    return {
        averages,
        days: filledDays
    };
};

/* ===== LAST 7 DAYS AVERAGES ===== */
export const getLast7DaysAverages = (days) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);

    const last7Days = days.filter(day => {
        const [year, month, dayOfMonth] = day.date.split("-").map(Number);

        const date = new Date(year, month - 1, dayOfMonth);

        return date >= sevenDaysAgo && date <= today;
    });

    const filledDays = last7Days.filter(day => {
        const totals = getDayTotals(day);
        return totals.kcal > 0;
    });

    if (filledDays.length === 0) {
        return {
            averages: {
                kcal: 0,
                weight: 0,
                protein: 0,
                fat: 0,
                carbs: 0
            },
            days: []
        };
    }

    const totals = filledDays.reduce(
        (acc, day) => {
            const dayTotals = getDayTotals(day);

            acc.kcal += dayTotals.kcal;
            acc.weight += dayTotals.weight;
            acc.protein += dayTotals.protein;
            acc.fat += dayTotals.fat;
            acc.carbs += dayTotals.carbs;

            return acc;
        },
        { kcal: 0, weight: 0, protein: 0, fat: 0, carbs: 0 }
    );

    const averages = {
        kcal: totals.kcal / filledDays.length,
        weight: totals.weight / filledDays.length,
        protein: totals.protein / filledDays.length,
        fat: totals.fat / filledDays.length,
        carbs: totals.carbs / filledDays.length
    };

    return {
        averages,
        days: filledDays
    };
};