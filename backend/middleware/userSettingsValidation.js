// Validates user settings according to the custom nutrition target rules.
const userSettingsValidation = (req, res, next) => {
    // Goal is required and must be one of the allowed values.
    if (
        req.body.goal !== "reduction" &&
        req.body.goal !== "maintenance" &&
        req.body.goal !== "mass"
    )
        return res.status(400).json("Wybierz prawidłowy cel żywieniowy");

    // The option for copying targets to new months must be a boolean.
    const copyTargetsToNewMonths = req.body.copy_targets_to_new_months;
    if (typeof copyTargetsToNewMonths !== "boolean")
        return res.status(400).json("Niepoprawny typ");

    // Custom daily targets are optional.
    // If the user does not configure any target, existing kcal limits remain active(deficitLimit and zeroLimit).
    const targets = [
        req.body.calorie_target,
        req.body.protein_target,
        req.body.fat_target,
        req.body.carbs_target
    ];

    const allTargetsEmpty = targets.every(target => target === null);
    if (allTargetsEmpty === true)
        return next();

    // Once the user configures custom targets, all four values must be provided.
    const someTargetEmpty = targets.some(target => target === null);
    if (someTargetEmpty === true)
        return res.status(400).json("Proszę ustawić wszystkie cele żywieniowe");

    // Every configured target must be a positive integer.
    const allTargetsValid = targets.every(target => Number.isInteger(target) && target > 0);
    if (allTargetsValid === false)
        return res.status(400).json("Wprowadzono niepoprawne wartości dla celów żywieniowych");

    return next();
}

module.exports = userSettingsValidation;