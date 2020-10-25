class Minuteur {
    constructor (heure, minute, seconde, type, pause = false) {
        this.heure = heure;
        this.minute = minute;
        this.seconde = seconde;
        this.type = type;
        this.pause = pause;
        this.deleted = false; // Permet d'arrêter le décompte des minuteurs si arrêté ou fini
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

    estNul () {
        return (this.heure === 0 && this.minute === 0 && this.seconde === 0)
    }

    changePause() {
        this.pause = !this.pause;
    }

    // Défilement du minuteur
    static fctMinuteur(minuteur, elmt) {
        if (minuteur.deleted) {
            // Permet d'arrêter le décompte des minuteurs si arrêté ou fini
            return;
        }
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

    changementBoutonValider () {
        let minuteur = this.type;
        let bouton = document.querySelector(`#div${minuteur} .boutonMinuteurValider`);
        let labelElmt = bouton.querySelector(".mdc-button__label");
        if (labelElmt.textContent === 'Lancer') {
            labelElmt.textContent = 'Pause';
        } else if (labelElmt.textContent === 'Pause') {
            labelElmt.textContent = 'Lancer';
        }
    }

    changementBoutonReset () {
        let minuteur = this.type;
        let bouton = document.querySelector(`#div${minuteur} .boutonMinuteurReset`);
        let labelElmt = bouton.querySelector(".mdc-button__label");
        if (labelElmt.textContent === 'Reset') {
            labelElmt.textContent = 'Arrêter';
        } else if (labelElmt.textContent === 'Arrêter') {
            labelElmt.textContent = 'Reset';
            this.changementBoutonValider();
            this.pause = false;
        }
    }
}