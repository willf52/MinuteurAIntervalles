let listMinuteurs = [];

function pauseMinuteur() {
    listMinuteurs[0].changementBouton();
    listMinuteurs[0].changePause();
}

function validerMinuteur () {
    //TODO mettre le type de minuteur en parametre si besoin pour celui à interval
    if (existe("affichageMinuteur") === false){
        // Minuteur jamais lancé
        let minuteur = document.getElementById("minuteurSimple");
        let ElmtsMinuteur = blocsMinuteur();
        // heure, minute, seconde

        // Verifications des valeurs des champs
        ElmtsMinuteur.heure.value = verif(ElmtsMinuteur.heure.value, "heure");
        ElmtsMinuteur.minute.value = verif(ElmtsMinuteur.minute.value, "minute");
        ElmtsMinuteur.seconde.value = verif(ElmtsMinuteur.seconde.value, "seconde");

        let minuteurObjet = new Minuteur(parseInt(ElmtsMinuteur.heure.value), parseInt(ElmtsMinuteur.minute.value), parseInt(ElmtsMinuteur.seconde.value), "minuteurSimple");
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
        minuteur.appendChild(minuteurElmt);

        minuteurObjet.changementBouton();

        let affichageMinuteurElmt = document.getElementById("affichageMinuteur");
        setTimeout(Minuteur.fctMinuteur, 1000, minuteurObjet, affichageMinuteurElmt);

        //TODO: voir pour truc asynchrone ? (pour que le changement sur le bouton ne se fasse que a la fin du chrono ?
        //minuteurObjet.changementBouton();
    } else {
        // Minuteur déjà lancé et mis en pause
        let affichageMinuteurElmt = document.getElementById("affichageMinuteur");
        let minuteur = affichageMinuteurElmt.textContent.split(":");
        let minuteurObjet = new Minuteur(minuteur[0], minuteur[1], minuteur[2], "minuteurSimple");
        listMinuteurs[0] = minuteurObjet;

        minuteurObjet.changementBouton();

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

function blocsMinuteur () {
    let heureElmt = document.querySelector("#minuteurSimple #heure");
    let minuteElmt = document.querySelector("#minuteurSimple #minute");
    let secondeElmt = document.querySelector("#minuteurSimple #seconde");

    return {heure: heureElmt, minute: minuteElmt, seconde: secondeElmt};
}

function resetMinuteur() {
    let minuteur = document.getElementById("minuteurSimple");

    let ElmtsMinuteur = blocsMinuteur();

    resetUnit(ElmtsMinuteur.heure);
    resetUnit(ElmtsMinuteur.minute);
    resetUnit(ElmtsMinuteur.seconde);

    if (existe("affichageMinuteur"))
        minuteur.removeChild(document.getElementById("affichageMinuteur"));

    let bouton = document.querySelector(`#${minuteur.id} #boutonMinuteurValider`);
    bouton.textContent = 'Lancer';
    listMinuteurs[0].pause = false;
}

function resetUnit (elmt) {
    elmt.value = 0;
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








