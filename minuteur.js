class Minuteur {
    constructor (heure, minute, seconde) {
        this.heure = heure;
        this.minute = minute;
        this.seconde = seconde;
    }

    getH() {
        return this.heure;
    }

    getM() {
        return this.minute;
    }

    getS() {
        return this.seconde;
    }

    setH(h) {
        this.heure = h;
    }

    setM(m) {
        this.minute = m;
    }

    setS(s) {
        this.seconde = s;
    }

    // Défilement du minuteur
    static fctMinuteur(minuteur, elmt) {
        if (minuteur.getS() > 0) {
            minuteur.seconde -= 1;

        } else {
            if (minuteur.getM() > 0) {
                minuteur.minute -= 1;
                minuteur.seconde = 59;

            } else {
                if (minuteur.getH() > 0) {
                    minuteur.heure -= 1;
                    minuteur.minute = 59;
                    minuteur.seconde = 59;

                }
            }
        }
        elmt.textContent = `${minuteur.heure}:${minuteur.minute}:${minuteur.seconde}`;
        setTimeout(Minuteur.fctMinuteur, 1000, minuteur, elmt);
        // setTimeout(getFctMinuteur, 976, this, elmt);
    }
}