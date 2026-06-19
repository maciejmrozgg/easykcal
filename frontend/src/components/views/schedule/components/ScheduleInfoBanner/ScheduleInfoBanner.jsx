import "./ScheduleInfoBanner.css";

export default function ScheduleInfoBanner() {
    return (
        <div className="schedule-info-banner">

            <div className="schedule-info-items">
                <div className="schedule-info-item schedule-info-item-deficit">
                    🔥 <strong>Deficyt</strong> – redukcja masy ciała
                </div>

                <div className="schedule-info-item schedule-info-item-zero">
                    ⚖️ <strong>Zero kaloryczne</strong> – utrzymanie masy ciała
                </div>
            </div>

            <p className="schedule-info-description">
                Jeśli nie znasz swoich wartości, możesz skorzystać z
                zewnętrznego kalkulatora zapotrzebowania kalorycznego
                lub obliczyć je samodzielnie.
            </p>

            <div className="schedule-info-coming-soon">
                Własny kalkulator zapotrzebowania kalorycznego jest w budowie.
            </div>

        </div>
    );
}