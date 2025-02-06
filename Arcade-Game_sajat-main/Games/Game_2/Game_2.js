// változók
const jatekter = document.querySelector(".jatekter");
const allapotJelzo = document.querySelector(".allapotJelzo");
const jelenlegiEredmeny = document.querySelector(".jelenlegiEredmeny");
const NehezsegMutato = document.querySelector(".NehezsegMutato")

let jatekterMeret = ( (localStorage.getItem("nehezseg") == null) ? 9 : localStorage.getItem("nehezseg") );
localStorage.setItem("nehezseg", jatekterMeret)

let vegsoPontszam = 0;
let pontszam = 0;

NehezsegMutato.innerHTML = "Jelenlegi nehézség: " + nehezsegKiValasztas()

let elsoSzam = null; // Az első kattintott mező
let masodikSzam = null; // A második kattintott mező
let kattintottSzamok = []; // A két kattintott szám

let sorokTomb = [];
let segesTomb = [];
let jatekMezoTomb = [];

// tömbök
let eredetiSzamTombNehez = [
    1, 2, 3, 4, 5, 6, 7, 8,
    9, 10, 11, 12, 13, 14, 15, 16,
    17, 18, 19, 20, 21, 22, 23, 24,
    25, 26, 27, 28, 29, 30, 31, 32,
    1, 2, 3, 4, 5, 6, 7, 8,
    9, 10, 11, 12, 13, 14, 15, 16,
    17, 18, 19, 20, 21, 22, 23, 24,
    25, 26, 27, 28, 29, 30, 31, 32
];

let eredetiSzamTombKozepes = [
    1, 2, 3, 4, 5, 6,
    7, 8, 9, 10, 11, 12,
    13, 14, 15, 16, 17, 18,
    1, 2, 3, 4, 5, 6,
    7, 8, 9, 10, 11, 12,
    13, 14, 15, 16, 17, 18
];

let eredetiSzamTombKonnyu = [
    1, 2, 3, 4, 5, 6, 7, 8,
    1, 2, 3, 4, 5, 6, 7, 8
];


// megkeveri a tömböt
let kevertSzamTomb = keveres( palyaMeghatarozas() );

// Létrehozza a játéktér elemeit
for (let i = 0; i < jatekterMeret * jatekterMeret; i++) {
    const jatekMezo = document.createElement("div");
    jatekter.appendChild(jatekMezo);

}
const mezok = Array.from(document.querySelectorAll(".jatekter div"));


//egyéb fügvények:
function jatekMezokFeltoltese() {
    
    let j = 0;

    for (i in mezok) {

        if (j >= (jatekterMeret) ) {
            sorokTomb.push(segesTomb)
            segesTomb = []
            j = 0;
        }
        j++;
        segesTomb.push(i)

    }   
    sorokTomb.push(segesTomb)


    for (let i = 1; i < jatekterMeret - 1; i+=2) {
        for (let j = 1; j < jatekterMeret - 1; j+=2) {
            //console.log(sorokTomb[i][j])

            jatekMezoTomb.push(sorokTomb[i][j])
        }
    }

    let k = 0
    
    jatekMezoTomb.forEach(paragrafusMezo => {
        const jatekMezo = mezok[paragrafusMezo];
        const paragrafus = document.createElement("p");
        paragrafus.textContent = kevertSzamTomb[k]; // A megfelelő szám hozzáadása a négyzethez
        paragrafus.style.width = "100%";
        paragrafus.style.height = "100%";
        paragrafus.style.color = "black";
        paragrafus.style.margin = "0"; // Töröljük az alapértelmezett margót
        paragrafus.style.display = "flex"; // Flexbox használata
        paragrafus.style.justifyContent = "center"; // Horizontálisan középre
        paragrafus.style.alignItems = "center"; // Vertikálisan középre
        paragrafus.style.border = "1px solid black"; 
        jatekMezo.appendChild(paragrafus);
        k++;
        }
    );

    jatekMezoTomb.forEach(kepMezo => {
        const jatekMezo = mezok[kepMezo];
        const kep = document.createElement("img");
        kep.src = "assets/kartyaHatlap.jpg"; // A megfelelő képfájl neve
        kep.style.width = "100%";
        kep.style.height = "100%";
        kep.style.cursor = "pointer"; // Kattintás mutató
        kep.style.border = "1px solid black"; 
    
        // a számpárok ellenőrzése
        kep.addEventListener("click", () => {
            // Ha az első mező nincs beállítva, állítsuk be
            if (!elsoSzam) {
                elsoSzam = jatekMezo;
                kattintottSzamok[0] = jatekMezo.querySelector("p").textContent; // Az első szám
                kep.style.display = "none"; // Kép eltüntetése
            } else { // Második kattintás
                masodikSzam = jatekMezo;
                kattintottSzamok[1] = jatekMezo.querySelector("p").textContent; // A második szám
                kep.style.display = "none"; // Kép eltüntetése

                // Ellenőrizzük a két kattintott számot
                setTimeout(() => {
                    if (kattintottSzamok[0] == kattintottSzamok[1]) {
                        // Ha a két szám egyezik, töröljük a p és img tageket
                        elsoSzam.querySelector("p").remove();
                        elsoSzam.querySelector("img").remove();
                        masodikSzam.querySelector("p").remove();
                        masodikSzam.querySelector("img").remove();
                        pontszam++;
                    } else {
                        // Ha nem egyeznek, a képek visszakerülnek
                        elsoSzam.querySelector("img").style.display = "block";
                        masodikSzam.querySelector("img").style.display = "block";
                    }

                    // A kattintott mezők nullázása
                    elsoSzam = null;
                    masodikSzam = null;
                    kattintottSzamok = [];
                }, 1000); // 1 másodperc után végrehajtjuk a műveletet
            }
        });
    
        jatekMezo.appendChild(kep);
    });

}

jatekMezokFeltoltese()

function keveres(tomb) {
    
    for (let i = tomb.length - 1; i > 0; i--) {
        // Véletlenszerű index az aktuális indexig (beleértve)
        const veletlenIndex = Math.floor(Math.random() * (i + 1));
        // Elemeket cserélünk az aktuális és a véletlenszerű index között
        [tomb[i], tomb[veletlenIndex]] = [tomb[veletlenIndex], tomb[i]];
    }

    return tomb;

}

function nehezsegBekeres() {

    let nehezseg = prompt("Milyen legyen a lehézség? (Könnyű, Közepes, Nehéz)")

    switch (nehezseg) {
        case "Könnyű":
            localStorage.setItem("nehezseg", 9)
            break;
        case "Közepes":
            localStorage.setItem("nehezseg", 13)
            break;
        case "Nehéz":
            localStorage.setItem("nehezseg", 17)
            break;
        default:
            alert("Kérlek a felkínált lehetőségek közül válasz!")
            nehezsegBekeres()
    }

}

function palyaMeghatarozas() {

    let palyaMeret = localStorage.getItem("nehezseg");

    switch (palyaMeret) {
        case "9":
            document.documentElement.style.setProperty("--size", "315px");
            return eredetiSzamTombKonnyu
        case "13":
            document.documentElement.style.setProperty("--size", "455px");
            return eredetiSzamTombKozepes
        case "17":
            document.documentElement.style.setProperty("--size", "595px");
            return eredetiSzamTombNehez
    }
}

function nehezsegKiValasztas() {

    let nehezseg = localStorage.getItem("nehezseg")

    switch (nehezseg) {
        case "9":
            vegsoPontszam = 8;
            return "Könnyű"
        case "13":
            vegsoPontszam = 18;
            return "Közepes"
        case "17":
            vegsoPontszam = 32;
            return "Nehéz"
    }
    
}

function ujratoltes() {
    localStorage.removeItem("nehezseg")
    location.reload()
}

function nehezsegAtalitas() {
    nehezsegBekeres()
    location.reload()
}

function jatekAllapotEsPontszamJelzo() {
    jelenlegiEredmeny.innerHTML = "Jelenlegi nehézség: " + vegsoPontszam + "/" + pontszam;

    if (vegsoPontszam == pontszam) {
        allapotJelzo.innerHTML = "A játék állapota: Nyertél!"
    }
}

const eredmenyMeallitas = setInterval(jatekAllapotEsPontszamJelzo, 1);
