import BaseModal from "../../ui/modal/BaseModal"
import "./UserSettingsModal.css"

const UserSettingsModal = ({ open, onClose }) => {
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
                        />
                        Redukcja
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="goal"
                            value="maintenance"
                        />
                        Utrzymanie
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="goal"
                            value="mass"
                        />
                        Masa
                    </label>
                </div>

                <h3>Dzienne cele</h3>

                <div className="targets-section">
                    <label>
                        Kalorie
                        <input type="number" />
                    </label>
                    <label>
                        Białko
                        <input type="number" />
                    </label>
                    <label>
                        Tłuszcze
                        <input type="number" />
                    </label>
                    <label>
                        Węglowodany
                        <input type="number" />
                    </label>
                </div>

                <div className="copy-settings">
                    <label>
                        <input
                            type="checkbox"
                            defaultChecked={true}
                        />
                        Automatycznie kopiuj cele do nowych miesięcy
                    </label>
                </div>

                <div className="modal-buttons">
                    <button
                        className="save"
                        type="submit">
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