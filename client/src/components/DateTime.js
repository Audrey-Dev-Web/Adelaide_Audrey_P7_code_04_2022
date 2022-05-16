import React, { useState, useEffect } from "react";

function DateTime(props) {
    const { datetime } = props;
    const [timeAfter, setTimeAfter] = useState(" ");
    const now = new Date();
    const date = new Date(datetime);
    let diff = {}; // Initialisation du retour

    function dateDiff(date1, date2) {
        var tmp = date2 - date1;

        tmp = Math.floor(tmp / 1000); // Nombre de secondes entre les 2 dates
        diff.sec = tmp % 60; // Extraction du nombre de secondes

        tmp = Math.floor((tmp - diff.sec) / 60); // Nombre de minutes (partie entière)
        diff.min = tmp % 60; // Extraction du nombre de minutes

        tmp = Math.floor((tmp - diff.min) / 60); // Nombre d'heures (entières)
        diff.hour = tmp % 24; // Extraction du nombre d'heures

        tmp = Math.floor((tmp - diff.hour) / 24); // Nombre de jours restants
        diff.day = tmp;

        return diff;
    }

    diff = dateDiff(date, now);

    function set_time() {
        if (diff.day <= 0 && diff.hour <= 0 && diff.min <= 0 && diff.sec > 0) {
            setTimeAfter(`${diff.sec} sec`);
        } else if (diff.day <= 0 && diff.hour <= 0 && diff.min > 0) {
            setTimeAfter(`${diff.min} min`);
        } else if (diff.day <= 0 && diff.hour > 0) {
            setTimeAfter(`${diff.hour} h`);
        } else if (diff.day > 0) {
            setTimeAfter(`${diff.day} jours`);
        }
    }

    useEffect(() => {
        set_time();
    }, []);

    return (
        <div className="dateTime">
            <span>depuis {timeAfter}</span>
        </div>
    );
}

export default DateTime;
