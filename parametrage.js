let listMinuteurs = []; // index 0 pour minuteur simple, 1, 2, ... pour intervalles ?

function pauseMinuteur (type) {
    if (type === "MinuteurSimple") {
        listMinuteurs[0].changementBoutonValider(); // change le visuel du bouton
        listMinuteurs[0].changePause(); // change le statut pause du minuteur
    } else if (type === "MinuteurIntervalle") {
        listMinuteurs[1].changementBoutonValider(); // change le visuel du bouton
        listMinuteurs[1].changePause(); // change le statut pause du minuteur
    }
}

function validerMinuteur () {
    //TODO mettre le type de minuteur en parametre si besoin pour celui à interval
    if (existe("affichageMinuteur") === false){
        // Minuteur jamais lancé
        let minuteur = document.getElementById(`div${type}`);
        let formMinuteur = document.getElementById(`form${type}`);
        // heure, minute, seconde

        // Verifications des valeurs des champs
        if (type === "MinuteurSimple") {
            formMinuteur.elements.heure.value = verif(formMinuteur.elements.heure.value, "heure");
            formMinuteur.elements.minute.value = verif(formMinuteur.elements.minute.value, "minute");
            formMinuteur.elements.seconde.value = verif(formMinuteur.elements.seconde.value, "seconde");
        } else if (type === "MinuteurIntervalle") {
            formMinuteur.elements.minuteT.value = verif(formMinuteur.elements.minuteT.value, "minute");
            formMinuteur.elements.secondeT.value = verif(formMinuteur.elements.secondeT.value, "seconde");
            formMinuteur.elements.minuteR.value = verif(formMinuteur.elements.minuteR.value, "minute");
            formMinuteur.elements.secondeR.value = verif(formMinuteur.elements.secondeR.value, "seconde");
            formMinuteur.elements.transition.value = verif(formMinuteur.elements.transition.value, "nombre");
            formMinuteur.elements.nbSeries.value = verif(formMinuteur.elements.nbSeries.value, "nombre");
        }

        let minuteurObjet;
        if (type === "MinuteurSimple") {
            minuteurObjet = new Minuteur(parseInt(formMinuteur.elements.heure.value),
                parseInt(formMinuteur.elements.minute.value),
                parseInt(formMinuteur.elements.seconde.value), type);
            listMinuteurs[0] = minuteurObjet;
        } else if (type === "MinuteurIntervalle") {
            for (let i = 1; i <= formMinuteur.elements.nbSeries.value; i += 3) {
                minuteurObjet = new Minuteur(0, 0,
                    parseInt(formMinuteur.elements.transition.value), type);
                listMinuteurs[i] = minuteurObjet;
                minuteurObjet = new Minuteur(0,
                    parseInt(formMinuteur.elements.minuteT.value),
                    parseInt(formMinuteur.elements.secondeT.value), type);
                listMinuteurs[i+1] = minuteurObjet;
                minuteurObjet = new Minuteur(0,
                    parseInt(formMinuteur.elements.minuteR.value),
                    parseInt(formMinuteur.elements.secondeR.value), type);
                listMinuteurs[i+2] = minuteurObjet;
            }
            minuteurObjet = listMinuteurs[1];
        }

        // Creation du div d'affichage
        let minuteurElmt = document.createElement("p");
        minuteurElmt.id = "affichageMinuteur";
        minuteurElmt.textContent += `${minuteurObjet.heure}:${minuteurObjet.minute}:${minuteurObjet.seconde}`;

        // Ajout à l'html
        minuteur.appendChild(minuteurElmt);

        // Change le bouton Lancer -> Pause
        minuteurObjet.changementBoutonValider();
        minuteurObjet.changementBoutonReset();

        activerDesactiverChamps(formMinuteur.elements, type);

        let affichageMinuteurElmt = document.getElementById("affichageMinuteur");
        setTimeout(Minuteur.fctMinuteur, 1000, minuteurObjet, affichageMinuteurElmt);

        //TODO: voir pour truc asynchrone ? (pour que le changement sur le bouton ne se fasse que a la fin du chrono ?
        //minuteurObjet.changementBouton();
    } else {
        // Minuteur déjà lancé et mis en pause
        let affichageMinuteurElmt = document.getElementById("affichageMinuteur");
        let minuteur = affichageMinuteurElmt.textContent.split(":");
        let minuteurObjet = new Minuteur(minuteur[0], minuteur[1], minuteur[2], type);
        if (type === "MinuteurSimple") {
            listMinuteurs[0] = minuteurObjet;
        } else if (type === "MinuteurIntervalle") {
            listMinuteurs[1] = minuteurObjet;
        }

        minuteurObjet.changementBoutonValider();

        setTimeout(Minuteur.fctMinuteur, 1000, minuteurObjet, affichageMinuteurElmt);
        //TODO: voir pour truc asynchrone ? (pour que le changement sur le bouton ne se fasse que a la fin du chrono ?
        //minuteurObjet.changementBouton();
    }
}

function existe (id) {
    return document.getElementById(id) !== null;
}

function verif (n, type) {
    /*
    Permet de mettre en forme et de vérifier les entrées nombre, et de renvoyer la valeur avec les éventuels changements
     */
    n = parseInt(n); // Passe les textes des champs en nombre
    if (n < 0 || isNaN(n)) { // isNan car si pas un nombre le parseInt renvoi Nan
        n = 0;
    }
    let limite;
    switch (type) {
        case "nombre":
            limite = 50;
            break;
        case "heure":
            limite = 12;
            break;
        case "minute":
            limite = 59;
            break;
        case "seconde":
            limite = 59;
            break;
        default:
            console.error(`Erreur dans la vérification de la valeur ${n} de type ${type}`);
            n = 0;
    }
    if (n > limite) {
        n = limite;
    }

    return n;

}

function resetMinuteur (type) {
    // Minuteur jamais lancé ou reset, Bouton Reset
    let formMinuteur = document.getElementById(`form${type}`);

    if (type === "MinuteurSimple") {
        resetUnit(formMinuteur.elements.heure);
        resetUnit(formMinuteur.elements.minute);
        resetUnit(formMinuteur.elements.seconde);
    } else if (type === "MinuteurIntervalle") {
        resetUnit(formMinuteur.minuteT);
        resetUnit(formMinuteur.secondeT);
        resetUnit(formMinuteur.minuteR);
        resetUnit(formMinuteur.secondeR);
        resetUnit(formMinuteur.transition);
        resetUnit(formMinuteur.nbSeries);
    }
}

function arretMinuteur (type) { // TODO: probleme avec le bouton arreter -> fait un reset non désirer !
    // Minuteur déjà lancé, lancé ou en pause, Bouton Arrêter
    let minuteur = document.getElementById(`div${type}`);
    let formMinuteur = document.getElementById(`form${type}`);

    minuteur.removeChild(document.getElementById("affichageMinuteur"));

    let boutonReset =  document.querySelector(`#${minuteur.id} .boutonMinuteurReset`);
    boutonReset.textContent = 'Reset';

    let boutonValider = document.querySelector(`#${minuteur.id} .boutonMinuteurValider`);
    boutonValider.textContent = 'Lancer';
    if (type === "MinuteurSimple") {
        listMinuteurs[0].pause = false;
    } else if (type === "MinuteurIntervalle") {
        listMinuteurs[1].pause = false;
    }

    activerDesactiverChamps(formMinuteur.elements, type);
}

function resetUnit (elmt) {
    elmt.value = 0;
}

function activerDesactiverChamps (formElmts, type) {
    if (type === "MinuteurSimple") {
        formElmts.heure.disabled = !formElmts.heure.disabled;
        formElmts.minute.disabled = !formElmts.minute.disabled;
        formElmts.seconde.disabled = !formElmts.seconde.disabled;
    } else if (type === "MinuteurIntervalle") {
        formElmts.minuteT.disabled = !formElmts.minuteT.disabled;
        formElmts.secondeT.disabled = !formElmts.secondeT.disabled;
        formElmts.minuteR.disabled = !formElmts.minuteR.disabled;
        formElmts.secondeR.disabled = !formElmts.secondeR.disabled;
        formElmts.transition.disabled = !formElmts.transition.disabled;
        formElmts.nbSeries.disabled = !formElmts.nbSeries.disabled;
    }
}


// Listeners pour le minuteur simple

let boutonMinuteur = document.getElementById("boutonMinuteurValider");
boutonMinuteur.addEventListener("click", function (e) {
    let bouton = e.target;
    if (bouton.textContent === "Lancer") {
        validerMinuteur("MinuteurSimple");
    } else if (bouton.textContent === "Pause") {
        pauseMinuteur("MinuteurSimple");
    } else {
        alert("erreur au lancement du minuteur")
    }
});

let boutonResetMinuteur = document.getElementById("boutonMinuteurReset");
boutonResetMinuteur.addEventListener("click", function (e) {
    let bouton = e.target;
    if (bouton.textContent === "Arrêter") {
        arretMinuteur("MinuteurSimple");
    } else if (bouton.textContent === "Reset") {
        resetMinuteur("MinuteurSimple");
    } else {
        alert("erreur au lancement du minuteur")
    }
});

// Listeners pour le minuteur à intervalles

let boutonMinuteurI = document.getElementById("boutonMinuteurIValider");
boutonMinuteurI.addEventListener("click", function (e) {
    let bouton = e.target;
    if (bouton.textContent === "Lancer") {
        validerMinuteur("MinuteurIntervalle");
    } else if (bouton.textContent === "Pause") {
        pauseMinuteur("MinuteurIntervalle");
    } else {
        alert("erreur au lancement du minuteur")
    }
});

let boutonResetMinuteurI = document.getElementById("boutonMinuteurIReset");
boutonResetMinuteurI.addEventListener("click", function (e) {
    let bouton = e.target;
    if (bouton.textContent === "Arrêter") {
        arretMinuteur("MinuteurIntervalle");
    } else if (bouton.textContent === "Reset") {
        resetMinuteur("MinuteurIntervalle");
    } else {
        alert("erreur au lancement du minuteur")
    }
});

// Annuler l'envoi automatique des formulaire sur une autre page
let forms = document.getElementsByTagName("form");
for (let f of forms) {
    f.addEventListener("submit", function (e) {
        e.preventDefault();
    });
}








