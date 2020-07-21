let listMinuteurs = []; // index 0 pour minuteur simple, 1, 2, ... pour intervalles ?

function pauseMinuteur() {
    listMinuteurs[0].changementBoutonValider(); // change le visuel du bouton
    listMinuteurs[0].changePause(); // change le statut pause du minuteur
}

function validerMinuteur () {
    //TODO mettre le type de minuteur en parametre si besoin pour celui à interval
    if (existe("affichageMinuteur") === false){
        // Minuteur jamais lancé
        let minuteur = document.getElementById("divMinuteurSimple");
        let formMinuteur = document.getElementById("formMinuteurSimple");
        // heure, minute, seconde

        // Verifications des valeurs des champs
        formMinuteur.elements.heure.value = verif(formMinuteur.elements.heure.value, "heure");
        formMinuteur.elements.minute.value = verif(formMinuteur.elements.minute.value, "minute");
        formMinuteur.elements.seconde.value = verif(formMinuteur.elements.seconde.value, "seconde");

        let minuteurObjet = new Minuteur(parseInt(formMinuteur.elements.heure.value),
                                            parseInt(formMinuteur.elements.minute.value),
                                            parseInt(formMinuteur.elements.seconde.value),
                                        'MinuteurSimple');
        listMinuteurs[0] = minuteurObjet;

        // Creation du div d'affichage
        let minuteurElmt = document.createElement("p");
        minuteurElmt.id = "affichageMinuteur";
        minuteurElmt.textContent += `${minuteurObjet.heure}:${minuteurObjet.minute}:${minuteurObjet.seconde}`;

        // if (existe("affichageMinuteur")) {
        //     minuteur.replaceChild(minuteurElmt, document.getElementById("affichageMinuteur"));
        // } else {
        //     minuteur.appendChild(minuteurElmt);
        // }
        // Ajout à l'html
        minuteur.appendChild(minuteurElmt);

        // Change le bouton Lancer -> Pause
        minuteurObjet.changementBoutonValider();
        minuteurObjet.changementBoutonReset();

        activerDesactiverChamps(formMinuteur.elements);

        let affichageMinuteurElmt = document.getElementById("affichageMinuteur");
        setTimeout(Minuteur.fctMinuteur, 1000, minuteurObjet, affichageMinuteurElmt);

        //TODO: voir pour truc asynchrone ? (pour que le changement sur le bouton ne se fasse que a la fin du chrono ?
        //minuteurObjet.changementBouton();
    } else {
        // Minuteur déjà lancé et mis en pause
        let affichageMinuteurElmt = document.getElementById("affichageMinuteur");
        let minuteur = affichageMinuteurElmt.textContent.split(":");
        let minuteurObjet = new Minuteur(minuteur[0], minuteur[1], minuteur[2], "MinuteurSimple");
        listMinuteurs[0] = minuteurObjet;

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

function resetMinuteur () {
    if (existe("affichageMinuteur")) {
        // Minuteur déjà lancé, lancé ou en pause, Bouton Arrêter
        let minuteur = document.getElementById("divMinuteurSimple");
        let formMinuteur = document.getElementById("formMinuteurSimple");

        minuteur.removeChild(document.getElementById("affichageMinuteur"));

        let boutonReset =  document.querySelector(`#${minuteur.id} #boutonMinuteurReset`);
        boutonReset.textContent = 'Reset';

        let boutonValider = document.querySelector(`#${minuteur.id} #boutonMinuteurValider`);
        boutonValider.textContent = 'Lancer';
        listMinuteurs[0].pause = false;

        activerDesactiverChamps(formMinuteur.elements);
    } else {
        // Minuteur jamais lancé ou reset, Bouton Reset
        let minuteur = document.getElementById("divMinuteurSimple");
        let formMinuteur = document.getElementById("formMinuteurSimple");

        resetUnit(formMinuteur.elements.heure);
        resetUnit(formMinuteur.elements.minute);
        resetUnit(formMinuteur.elements.seconde);
    }
}

function resetUnit (elmt) {
    elmt.value = 0;
}

function activerDesactiverChamps (formElmts) {
    formElmts.heure.disabled = !formElmts.heure.disabled;
    formElmts.minute.disabled = !formElmts.minute.disabled;
    formElmts.seconde.disabled = !formElmts.seconde.disabled;
}

let boutonMinuteur = document.getElementById("boutonMinuteurValider");
boutonMinuteur.addEventListener("click", function (e) {
    let bouton = e.target;
    if (bouton.textContent === "Lancer") {
        validerMinuteur();
    } else if (bouton.textContent === "Pause") {
        pauseMinuteur();
    } else {
        alert("erreur au lancement du minuteur")
    }
});

// let boutonResetMinuteur = document.getElementById("boutonMinuteurReset");
// boutonResetMinuteur.addEventListener("click", resetMinuteur);


// Annuler l'envoi automatique des formulaire sur une autre page
let forms = document.getElementsByTagName("form");
for (let f of forms) {
    f.addEventListener("submit", function (e) {
        e.preventDefault();
    });
}

// function getFctMinuteur(o_, elmt) {
//     /*
//     Permet de d'utiliser la fonction dans le setTimeout si la fonction est une fonction de classe
//      */
//     return o_.fctMinuteur(elmt);
// }








