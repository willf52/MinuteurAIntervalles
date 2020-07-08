function validerMinuteur () {

    let minuteur = document.getElementById("minuteur");

    let heure = document.querySelector("#minuteur #heure");
    let minute = document.querySelector("#minuteur #minute");
    let seconde = document.querySelector("#minuteur #seconde");


    heure.value = verif(heure.value, "heure");
    minute.value = verif(minute.value, "minute");
    seconde.value = verif(seconde.value, "seconde");


    let minuteurElmt = document.createElement("p");
    minuteurElmt.id = "affichageMinuteur";
    minuteurElmt.textContent += `${heure.value}:${minute.value}:${seconde.value}`;

    if (existe("affichageMinuteur")) {
        minuteur.replaceChild(minuteurElmt, document.getElementById("affichageMinuteur"));
    } else {
        minuteur.appendChild(minuteurElmt);
    }

    let affichageMinuteurElmt = document.getElementById("affichageMinuteur");
    setTimeout(fctMinuteur, 1000, affichageMinuteurElmt);
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

function resetMinuteur() {
    let minuteur = document.getElementById("minuteur");

    let heure = document.querySelector("#minuteur #heure");
    let minute = document.querySelector("#minuteur #minute");
    let seconde = document.querySelector("#minuteur #seconde");

    resetUnit(heure);
    resetUnit(minute);
    resetUnit(seconde);

    if (existe("affichageMinuteur"))
        minuteur.removeChild(document.getElementById("affichageMinuteur"));
}

function resetUnit (elmt) {
    elmt.value = 0;
}

// let boutonMinuteur = document.getElementById("boutonMinuteurValider");
// boutonMinuteur.addEventListener("click", minuteur);

// let boutonResetMinuteur = document.getElementById("boutonMinuteurReset");
// boutonResetMinuteur.addEventListener("click", resetMinuteur);


// Annuler l'envoi automatique des formulaire sur une autre page
let forms = document.getElementsByTagName("form");
for (let f of forms) {
    f.addEventListener("submit", function (e) {
        e.preventDefault();
    });
}


// Défilement du minuteur
function fctMinuteur(elmt) {
    let time = elmt.textContent.split(":");

    let heure = parseInt(time[0]);
    let minute = parseInt(time[1]);
    let seconde = parseInt(time[2]);

    if (seconde > 0) {
        seconde -= 1;

    } else {
        if (minute > 0) {
            minute -= 1;
            seconde = 59;

        } else {
            if (heure > 0) {
                heure -= 1;
                minute = 59;
                seconde = 59;

            }
        }
    }
    elmt.textContent = `${heure}:${minute}:${seconde}`;
    setTimeout(fctMinuteur, 1000, elmt);
}

class Minuteur {
    constructor (heure, minute, seconde) {
        this.heure = heure;
        this.minute = minute;
        this.seconde = seconde;
    }

}






// TODO: suite du cours pour pouvoir afficher le chrono
