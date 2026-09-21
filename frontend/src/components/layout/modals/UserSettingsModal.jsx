import { useEffect, useState } from "react"
import BaseModal from "../../ui/modal/BaseModal"
import userSettingsApi from "../api/userSettingsApi";
import "./UserSettingsModal.css"
import { useToast } from "../../ui/toast/hooks/useToast";

const UserSettingsModal = ({ open, onClose, updateUserSettings }) => {
    const [userSettings, setUserSettings] = useState({
        goal: null,
        calorie_target: null,
        protein_target: null,
        fat_target: null,
        carbs_target: null,
        copy_targets_to_new_months: true
    });
    const { showToast } = useToast();

    useEffect(() => {
        fetchUserSettings();
    }, [open]);

    // Fetches the current user's settings when the modal is opened.
    const fetchUserSettings = async () => {
        if (open === true) {
            try {
                const data = await userSettingsApi.getUserSettings()
                setUserSettings(data);
            } catch (error) {
                showToast(
                    error.message,
                    "error"
                );
            }
        }
    }

    // Validates and saves the current user settings to the backend.
    const saveUserSettings = async () => {
        const validationError = validateUserSettings(userSettings);

        if (validationError !== null) {
            showToast(
                validationError,
                "error"
            );
            return;
        }

        try {
            const updatedSettings = await userSettingsApi.updateUserSettings(userSettings);
            setUserSettings(updatedSettings);
            updateUserSettings(updatedSettings);
            showToast(
                "Ustawienia zostały zapisane",
                "success"
            );
        } catch (error) {
            showToast(
                error.message,
                "error"
            );
        }
    }

    // Validates user settings according to the custom nutrition target rules.
    const validateUserSettings = (userSettings) => {
        // Goal is required and must be one of the allowed values.
        if (
            userSettings.goal !== "reduction" &&
            userSettings.goal !== "maintenance" &&
            userSettings.goal !== "mass"
        )
            return "Wybierz prawidłowy cel żywieniowy"

        // Custom daily targets are optional.
        // If the user does not configure any target, existing kcal limits remain active(deficitLimit and zeroLimit).
        const targets = [
            userSettings.calorie_target,
            userSettings.protein_target,
            userSettings.fat_target,
            userSettings.carbs_target
        ];

        const allTargetsEmpty = targets.every(target => target === null);
        if (allTargetsEmpty === true)
            return null;

        // Once the user configures custom targets, all four values must be provided.
        const someTargetEmpty = targets.some(target => target === null);
        if (someTargetEmpty === true)
            return "Proszę ustawić wszystkie cele żywieniowe"

        // Every configured target must be a positive integer.
        const allTargetsValid = targets.every(target => Number.isInteger(target) && target > 0);
        if (allTargetsValid === false)
            return "Wprowadzono niepoprawne wartości dla celów żywieniowych"

        return null;
    }

    return (
        <BaseModal
            open={open}
            title="Ustawienia użytkownika"
            onClose={onClose}
            className="user-settings-modal"
        >
            <div className="user-settings-form">
                <h3>Cel żywieniowy</h3>

                <div className="goal-section">
                    <label>
                        <input
                            type="radio"
                            name="goal"
                            value="reduction"
                            checked={userSettings.goal === "reduction"}
                            onChange={(e) => setUserSettings({ ...userSettings, goal: e.target.value })}
                        />
                        Redukcja
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="goal"
                            value="maintenance"
                            checked={userSettings.goal === "maintenance"}
                            onChange={(e) => setUserSettings({ ...userSettings, goal: e.target.value })}
                        />
                        Utrzymanie
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="goal"
                            value="mass"
                            checked={userSettings.goal === "mass"}
                            onChange={(e) => setUserSettings({ ...userSettings, goal: e.target.value })}
                        />
                        Masa
                    </label>
                </div>

                <h3>Dzienne cele</h3>

                <div className="targets-section">
                    <label>
                        Kalorie
                        <input
                            type="number"
                            value={userSettings.calorie_target === null ? "" : userSettings.calorie_target}
                            onChange={(e) => setUserSettings({ ...userSettings, calorie_target: e.target.value === "" ? null : +e.target.value })}
                        />
                    </label>
                    <label>
                        Białko
                        <input
                            type="number"
                            value={userSettings.protein_target === null ? "" : userSettings.protein_target}
                            onChange={(e) => setUserSettings({ ...userSettings, protein_target: e.target.value === "" ? null : +e.target.value })}
                        />
                    </label>
                    <label>
                        Tłuszcze
                        <input
                            type="number"
                            value={userSettings.fat_target === null ? "" : userSettings.fat_target}
                            onChange={(e) => setUserSettings({ ...userSettings, fat_target: e.target.value === "" ? null : +e.target.value })}
                        />
                    </label>
                    <label>
                        Węglowodany
                        <input
                            type="number"
                            value={userSettings.carbs_target === null ? "" : userSettings.carbs_target}
                            onChange={(e) => setUserSettings({ ...userSettings, carbs_target: e.target.value === "" ? null : +e.target.value })}
                        />
                    </label>
                </div>

                <div className="copy-settings">
                    <label>
                        <input
                            type="checkbox"
                            checked={userSettings.copy_targets_to_new_months === true}
                            onChange={(e) => setUserSettings({ ...userSettings, copy_targets_to_new_months: e.target.checked })}
                        />
                        Automatycznie kopiuj cele do nowych miesięcy
                    </label>
                </div>

                <div className="modal-buttons">
                    <button
                        className="save"
                        type="submit"
                        onClick={saveUserSettings}
                    >
                        Zapisz
                    </button>

                    <button
                        className="cancel"
                        type="button"
                        onClick={onClose}
                    >
                        Anuluj
                    </button>
                </div>
            </div>
        </BaseModal>
    )
}

export default UserSettingsModal;