let listMinuteurs = []; // index 0 pour minuteur simple, 1, 2, ... pour intervalles ?

function pauseMinuteur (type) {
    if (type === "MinuteurSimple") {
        listMinuteurs[0].changementBoutonValider(); // change le visuel du bouton
        listMinuteurs[0].changePause(); // change le statut pause du minuteur
    } else if (type === "MinuteurIntervalle") {
        if (listMinuteurs[1].estNul()) { // pour permettre la pause à 0:0:0 (seconde d'attente dans estFini()
            listMinuteurs[2].changementBoutonValider(); // change le visuel du bouton
            listMinuteurs[2].changePause(); // change le statut pause du minuteur
        } else {
            listMinuteurs[1].changementBoutonValider(); // change le visuel du bouton
            listMinuteurs[1].changePause(); // change le statut pause du minuteur
        }
    }
}

function finMinuteur (type) {
    let minuteur = document.querySelector(`#div${type}`);
    // let affichageMinuteurElmt = document.querySelector(`#div${type} .affichageMinuteur`);
    let formMinuteur = document.getElementById(`form${type}`);

    if (type === "MinuteurIntervalle") {
        if (listMinuteurs[2]) {
            listMinuteurs[1].pause = false;
            listMinuteurs[1].deleted = true;
            // Minuteur (sauf dernier) d'un Minuteur à intervalle
            listMinuteurs.splice(1, 1); // supprimer le minuteur terminé
            debutMinuteur(type, listMinuteurs[1], minuteur, formMinuteur, false)
        } else {
            // Dernier minuteur d'un Minuteur à intervalle
            arretMinuteur(type);
        }
    } else if (type === "MinuteurSimple") {
        arretMinuteur(type);
    }
}

function debutMinuteur (type, minuteurObjet, minuteur, formMinuteur, firstMinuteur = true) {
    // Lance concrètement le décompte

    // Récupération du div d'affichage
    let minuteurElmt = document.querySelector(`#div${type} .affichageMinuteur`);

    // Ajout du texte
    minuteurElmt.textContent = `${minuteurObjet.heure}:${minuteurObjet.minute}:${minuteurObjet.seconde}`;

    if (firstMinuteur) { // Si c'est le premier minuteur de la liste (pour minuteur à intervalle notamment
        // Change le bouton Lancer -> Pause
        minuteurObjet.changementBoutonValider();
        minuteurObjet.changementBoutonReset();

        activerDesactiverChamps(formMinuteur.elements, type);

    }

    let affichageMinuteurElmt = minuteur.querySelector(`#div${type} .affichageMinuteur`);
    setTimeout(Minuteur.fctMinuteur, 1000, minuteurObjet, affichageMinuteurElmt);
}


function validerMinuteur (type) {
    if (estVide(`#div${type} .affichageMinuteur`) === true){
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
            const nbSerie = parseInt(formMinuteur.elements.nbSeries.value);
            for (let i = 1; i < (nbSerie * 4) + 1; i += 4) {
                minuteurObjet = new Minuteur(0, 0,
                    parseInt(formMinuteur.elements.transition.value), type);
                 listMinuteurs[i] = minuteurObjet;
                minuteurObjet = new Minuteur(0,
                    parseInt(formMinuteur.elements.minuteT.value),
                    parseInt(formMinuteur.elements.secondeT.value), type);
                listMinuteurs[i+1] = minuteurObjet;
                minuteurObjet = new Minuteur(0, 0,
                    parseInt(formMinuteur.elements.transition.value), type);
                listMinuteurs[i+2] = minuteurObjet;
                minuteurObjet = new Minuteur(0,
                    parseInt(formMinuteur.elements.minuteR.value),
                    parseInt(formMinuteur.elements.secondeR.value), type);
                listMinuteurs[i+3] = minuteurObjet;
            }

            // Permet d'enlever concrètement les lignes de minuteurs nuls
            for (let i = 1; i < listMinuteurs.length; i++) {
                if (listMinuteurs[i].estNul()) listMinuteurs.splice(i, 1)
            }

            minuteurObjet = listMinuteurs[1];
        }

        debutMinuteur(type, minuteurObjet, minuteur, formMinuteur);

    } else {
        // Minuteur déjà lancé et mis en pause
        let affichageMinuteurElmt = document.querySelector(`#div${type} .affichageMinuteur`);
        let minuteurObjet;
        if (type === "MinuteurSimple") {
            minuteurObjet = listMinuteurs[0];
        } else if (type === "MinuteurIntervalle") {
            minuteurObjet = listMinuteurs[1];
        }

        minuteurObjet.changePause(); // enlève la pause
        minuteurObjet.changementBoutonValider();

        setTimeout(Minuteur.fctMinuteur, 1000, minuteurObjet, affichageMinuteurElmt);
    }
}

function estVide (selector) {
    let elmt = document.querySelector(selector);
    return elmt.textContent === "";
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

function arretMinuteur (type) {
    // Minuteur déjà lancé, lancé ou en pause, Bouton Arrêter
    let minuteur = document.getElementById(`div${type}`);
    let formMinuteur = document.getElementById(`form${type}`);

    let affichage = minuteur.querySelector(`#div${type} .affichageMinuteur`);
    affichage.textContent = "";

    let boutonReset =  document.querySelector(`#${minuteur.id} .boutonMinuteurReset`);
    boutonReset.textContent = 'Reset';

    let boutonValider = document.querySelector(`#${minuteur.id} .boutonMinuteurValider`);
    boutonValider.textContent = 'Lancer';
    if (type === "MinuteurSimple") {
        listMinuteurs[0].pause = false;
        listMinuteurs[0].deleted = true;
    } else if (type === "MinuteurIntervalle") {
        listMinuteurs[1].pause = false;
        listMinuteurs[1].deleted = true;
        listMinuteurs.splice(1, listMinuteurs.length-1); // supprimer les minuteurs qui étaient en attentes
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
        alert("erreur à l'arrêt du minuteur")
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
        alert("erreur à l'arrêt du minuteur")
    }
});


function estFini (mutationList, mutationObject) {
    // Permet de détecter la fin d'un minuteur
    for (let mutation of mutationList) {
        if (mutation.type === 'childList') {
            if (mutation.target.textContent === "0:0:0") {
                const idParent = mutation.target.parentElement.id;
                let type;
                if (idParent === "divMinuteurSimple") {
                    type = "MinuteurSimple";
                } else if (idParent === "divMinuteurIntervalle") {
                    type = "MinuteurIntervalle";
                }
                setTimeout(finMinuteur, 1000, type);
            }
        }
    }
}

let divs = document.getElementsByClassName("cadreMinuteurs");
for (let d of divs) {
    let affichage = document.querySelector(`#${d.id} .affichageMinuteur`);
    let observer = new MutationObserver(estFini);
    let option = { characterData: false, attributes: false, childList: true, subtree: false };
    observer.observe(affichage, option);
}


let forms = document.getElementsByTagName("form");
for (let f of forms) {
    // Annuler l'envoi automatique des formulaires sur une autre page
    f.addEventListener("submit", function (e) {
        e.preventDefault();
    });
}




