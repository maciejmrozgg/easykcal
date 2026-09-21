import './DaySummary.css'

export default function DaySummary({ dayTotals, userSettings, deficitLimit, zeroLimit }) {
    // Classifies the daily calorie total based on the user's goal and calorie target
    const getLimitClass = (kcal) => {
        if (kcal === 0) {
            return;
        }

        // With custom target
        if (userSettings.calorie_target !== null) {
            const target = userSettings.calorie_target;
            if (userSettings.goal === "mass") {
                if (kcal <= target - 200) return "danger";
                if (kcal < target) return "warning";
                if (kcal >= target) return "normal";
            };

            if (userSettings.goal === "reduction") {
                if (kcal < target - 200) return "normal";
                if ((target - 200 <= kcal) && (kcal <= target)) return "warning";
                if (kcal > target) return "danger";
            };

            if (userSettings.goal === "maintenance") {
                if (kcal < target - 50) return "normal";
                if ((target - 50 <= kcal) && (kcal <= target + 50)) return "warning";
                if (kcal > target + 50) return "danger";
            };
        };

        // Fall back to the default calorie limits when no custom target is configured
        if (kcal > zeroLimit) return "danger";
        if (kcal > deficitLimit) return "warning";
        if (kcal > 0) return "normal";
    };

    // Calculates progress as a percentage of the target value
    const getProgress = (value, target) => {
        if (target <= 0) return 0;

        const progress = value / target * 100
        return Number(progress.toFixed(1));
    };

    // Determines the visual status of a macro progress bar
    const getMacroProgressStatus = (progress) => {
        if (progress === 0) return "macro-zero"
        if (progress < 50) return "macro-danger"
        if (progress >= 50 && progress < 90)
            return "macro-warning"
        else
            return "macro-success"
    };

    // Defines the daily macro values and their custom targets
    const macros = [
        {
            label: "B",
            value: dayTotals.protein,
            target: userSettings.protein_target,
        },
        {
            label: "T",
            value: dayTotals.fat,
            target: userSettings.fat_target,
        },
        {
            label: "W",
            value: dayTotals.carbs,
            target: userSettings.carbs_target,
        }
    ];

    // Calculates progress and display width for each macro
    const macroProgressSummary = macros.map(macro => {
        const progress = getProgress(
            macro.value,
            macro.target
        );

        const width = Math.max(0, Math.min(progress, 100));

        const progressStatus = getMacroProgressStatus(progress);

        return {
            ...macro,
            progress,
            width,
            progressStatus
        };
    });

    // Calculates calorie progress against the custom daily calorie target
    const calorieProgress = getProgress(
        dayTotals.kcal,
        userSettings.calorie_target
    );

    // Caps the progress bar width at 100%, while keeping the actual percentage
    const calorieWidth = Math.max(0, Math.min(calorieProgress, 100));

    // Determines the visual status of the daily calorie total
    const calorieStatus = getLimitClass(dayTotals.kcal);

    return (
        <div className={`meal-cell total ${calorieStatus}`}>
            <strong>Suma dnia: {dayTotals.weight}g / {dayTotals.kcal} kcal</strong>

            {userSettings.calorie_target !== null && (
                <div>
                    <div className="calorie-summary">
                        <strong>Cel kcal: {userSettings.calorie_target} kcal</strong>
                        <strong>Zjedzone: {dayTotals.kcal} kcal ({calorieProgress}%)</strong>
                    </div>

                    <div className="progress-bar">
                        <div
                            className={`progress-fill ${calorieStatus}`}
                            style={{ width: `${calorieWidth}%` }}
                        />
                    </div>

                    {macroProgressSummary.map(macro => (
                        <div key={macro.label}>
                            <div className={`macro-row ${macro.progressStatus}`}>
                                {macro.label}: {macro.value.toFixed(1)}g ({macro.progress}%)
                            </div>

                            <div className="progress-bar">
                                <div
                                    data-testid={`${macro.label}-progress`}
                                    className={`progress-fill ${macro.progressStatus}`}
                                    style={{ width: `${macro.width}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {userSettings.calorie_target === null && (
                <div>
                    {macros.map(macro => (
                        <div key={macro.label}>
                            {macro.label}: {macro.value.toFixed(1)}g
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}