// változók
const jatekter = document.querySelector(".jatekter");
const allapotJelzo = document.querySelector(".allapotJelzo");
const jelenlegiEredmeny = document.querySelector(".jelenlegiEredmeny");
const eddigiKattintas = document.querySelector(".eddigiKattintas");
const maxEredmeny = document.querySelector(".legjobbEredmeny");
const NehezsegMutato = document.querySelector(".NehezsegMutato")

let jatekterMeret = "13"

let vegsoPontszam = "18";
let pontszam = 0;

let elsoSzam = null; // Az első kattintott mező
let masodikSzam = null; // A második kattintott mező
let kattintottSzamok = []; // A két kattintott szám

let sorokTomb = [];
let segesTomb = [];
let jatekMezoTomb = [];

document.addEventListener("keydown", ujratoltes)

let kattintasokSzama = 0;

// tömbök
let eredetiSzamTombKozepes = [
    1, 2, 3, 4, 5, 6,
    7, 8, 9, 10, 11, 12,
    13, 14, 15, 16, 17, 18,
    1, 2, 3, 4, 5, 6,
    7, 8, 9, 10, 11, 12,
    13, 14, 15, 16, 17, 18
];



// megkeveri a tömböt
let kevertSzamTomb = keveres(eredetiSzamTombKozepes);

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
        paragrafus.style.color = "white";
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
            // Kattintások számának növelése
            kattintasokSzama++;
            eddigiKattintas.innerHTML = "Flipped Cards: " + kattintasokSzama;
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

function ujratoltes(e) {
    if (e.code === "Space") {
        location.reload();
    }
}

// ...existing code...

function fetchMaxEredmenyFromDatabase() {
    fetch('get_high_score.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const max = data.high_score || Infinity;
                if (max === Infinity) {
                    maxEredmeny.innerHTML = "High score: -";
                } else {
                    maxEredmeny.innerHTML = "High score: " + max;
                }
            } else {
                console.error("Nem sikerült lekérni az adatbázisból az eredményt:", data.message);
            }
        })
        .catch(error => {
            console.error("Hiba történt a lekérés során:", error);
        });
}

function updateMaxEredmenyInDatabase(ujEredmeny) {
    fetch('get_high_score.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const jelenlegiHighScore = data.high_score || Infinity;
                if (ujEredmeny < jelenlegiHighScore) {
                    // csak akkor küldjük be, ha jobb
                    fetch('update_high_score.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ high_score: ujEredmeny })
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            console.log("Sikeresen frissítve az új legjobb eredmény:", ujEredmeny);
                            maxEredmeny.innerHTML = "High score: " + ujEredmeny;
                        } else {
                            console.error("Nem sikerült frissíteni:", data.message);
                        }
                    });
                } else {
                    // Always refresh the display, even if not a new high score
                    maxEredmeny.innerHTML = "High score: " + jelenlegiHighScore;
                }
            }
        })
        .catch(error => {
            console.error("Hiba történt az ellenőrzés során:", error);
        });
}

function jatekAllapotEsPontszamJelzo() {

    if (pontszam == 18) {
        updateMaxEredmenyInDatabase(kattintasokSzama);
        clearInterval(eredmenyMeallitas); 
        document.getElementById('won1').style.display = 'block';
        document.getElementById('won2').style.display = 'block';
    }
}


const eredmenyMeallitas = setInterval(jatekAllapotEsPontszamJelzo, 100); // 100ms is enough

document.addEventListener("DOMContentLoaded", () => {
    fetchMaxEredmenyFromDatabase();
});