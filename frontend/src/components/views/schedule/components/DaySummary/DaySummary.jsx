import macroTargets from '../../constants/macroTargets'
import './DaySummary.css'

export default function DaySummary({ dayTotals, deficitLimit, zeroLimit }) {
    const getLimitClass = (kcal) => {
        if (kcal > zeroLimit) return "danger";
        if (kcal > deficitLimit) return "warning";
        if (kcal > 0) return "normal";
    };

    const getMacroProgress = (value, target) => {
        if (target <= 0) return 0;

        const progress = value / target * 100
        return Number(progress.toFixed(1));
    };

    const getMacroProgressStatus = (progress) => {
        if (progress === 0) return "macro-zero"
        if (progress < 50) return "macro-danger"
        if (progress >= 50 && progress < 90)
            return "macro-warning"
        else
            return "macro-success"
    };

    const macros = [
        {
            label: "B",
            value: dayTotals.protein,
            target: macroTargets.protein,
        },
        {
            label: "T",
            value: dayTotals.fat,
            target: macroTargets.fat,
        },
        {
            label: "W",
            value: dayTotals.carbs,
            target: macroTargets.carbs,
        }
    ];

    const macroProgressSummary = macros.map(macro => {
        const progress = getMacroProgress(
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

    return (
        <div className={`meal-cell total ${getLimitClass(dayTotals.kcal)}`}>
            <strong>Suma dnia: {dayTotals.weight}g / {dayTotals.kcal} kcal</strong>

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
    );
}