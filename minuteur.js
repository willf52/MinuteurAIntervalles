class Minuteur {
    constructor (heure, minute, seconde, type, pause = false) {
        this.heure = heure;
        this.minute = minute;
        this.seconde = seconde;
        this.type = type;
        this.pause = pause;
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

    changePause() {
        this.pause = !this.pause;
    }

    // Défilement du minuteur
    static fctMinuteur(minuteur, elmt) {
        if (minuteur.pause === false) {
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

    changementBouton () {
        let minuteur = this.type;
        let bouton = document.querySelector(`#${minuteur} #boutonMinuteurValider`);
        if (bouton.textContent === 'Lancer') {
            bouton.textContent = 'Pause';
        } else if (bouton.textContent === 'Pause') {
            bouton.textContent = 'Lancer';
        }
    }
}