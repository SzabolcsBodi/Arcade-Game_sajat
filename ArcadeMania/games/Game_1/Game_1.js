// változók
const jatekter = document.querySelector(".jatekter");
const allapotJelzo = document.querySelector(".allapotJelzo");
const jelenlegiEredmeny = document.querySelector(".jelenlegiEredmeny");
const maxEredmeny = document.querySelector(".maxEredmeny");
const jatekterMeret = 15;
let jatekoshelye = 202;
let tamadok = [];
let pontosEredmeny = 0;
let jatekVege = false;
let sebesseg = 1000

// Időzítők a támadók generálására és mozgatására
const tamadoGeneralas = setInterval(tamadokLetrehozasa, sebesseg);
const tamadoMozgatas = setInterval(tamadokMozgatasa, sebesseg);
const lezerMozgatasa = setInterval(lezerKepHozzaad, 100);
const robbanasHozzaadas = setInterval(robbanasKepHozzaad, 300)
const jatekosMozgatas = setInterval(jatekosKepHozzaad, 1)
const kepTisztantarto = setInterval(kepTisztantart, 1)

document.addEventListener("keydown", jatekosMozgatasa);
document.addEventListener("keydown", loves);
document.addEventListener("keydown", ujratoltes)

// Létrehozza a játéktér elemeit
for (let i = 0; i < jatekterMeret * jatekterMeret; i++) {
    const jatekMezo = document.createElement("div");
    jatekter.appendChild(jatekMezo);
}
const mezok = Array.from(document.querySelectorAll(".jatekter div"));

// A játékos inicializálása
mezok[jatekoshelye].classList.add("jatekosRepulo");

//egyéb fügvények:

// Kép hozzáadása a támodókhoz
function tamadokKepHozzaad() {
    tamadok.forEach(tamadoPozicio => {
        const jatekMezo = mezok[tamadoPozicio];
        if (!jatekMezo.querySelector("img")) {
            const kep = document.createElement("img");
            kep.src = "assets/bombazoRepulo.jpg"; // A megfelelő képfájl neve
            kep.style.width = "100%";
            kep.style.height = "100%";
            jatekMezo.appendChild(kep);
        }
    });
}

function lezerKepHozzaad() {
    mezok.forEach(jatekMezo => {
        if (jatekMezo.classList.contains("lovedek")) {
            const kep = document.createElement("img");
            kep.src = "assets/lovedek.jpg"; // A megfelelő képfájl neve
            kep.style.width = "100%";
            kep.style.height = "100%";
            jatekMezo.appendChild(kep);
        }
    });
}

function robbanasKepHozzaad() {
    mezok.forEach(jatekMezo => {
        if (jatekMezo.classList.contains("robbanas")) {
            const kep = document.createElement("img");
            kep.src = "assets/robbanas.jpg"; // A megfelelő képfájl neve
            kep.style.width = "100%";
            kep.style.height = "100%";
            jatekMezo.appendChild(kep);
        }
    });
}

function jatekosKepHozzaad() {
    mezok.forEach(jatekMezo => {
        if (jatekMezo.classList.contains("jatekosRepulo") && !jatekMezo.querySelector("img")) {
            const kep = document.createElement("img");
            kep.src = "assets/jatekosRepulo.jpg"; // A megfelelő képfájl neve
            kep.style.width = "100%";
            kep.style.height = "100%";
            jatekMezo.appendChild(kep);
        }
    });
}

// Eltávolítja a képeket az "bombazoRepulo" osztállyal nem rendelkező mezőkről
function kepEltavolitas() {
    mezok.forEach(jatekMezo => {
        if (!jatekMezo.classList.contains("bombazoRepulo") && !jatekMezo.classList.contains("jatekosRepulo") && !jatekMezo.classList.contains("lovedek") && !jatekMezo.classList.contains("robbanas")) {
            const kep = jatekMezo.querySelector("img");
            if (kep) {
                jatekMezo.removeChild(kep);
            }
        }
    });
}

// Új támodók létrehozása a jatekter tetején
function tamadokLetrehozasa() {
    const kiIndulasiHely = Math.floor(Math.random() * jatekterMeret);
    const tamadoHelyzete = kiIndulasiHely;

    if (!mezok[tamadoHelyzete].classList.contains("bombazoRepulo")) {
        tamadok.push(tamadoHelyzete);
        mezok[tamadoHelyzete].classList.add("bombazoRepulo");
        tamadokKepHozzaad();
    }
}

// Az támadók lefelé mozgatása
function tamadokMozgatasa() {
    const ujtamadok = [];
    tamadok.forEach(tamadoPozicio => {
        mezok[tamadoPozicio].classList.remove("bombazoRepulo");
        const kep = mezok[tamadoPozicio].querySelector("img");
        if (kep) {
            mezok[tamadoPozicio].removeChild(kep);
        }

        const tamadoUjPozicio = tamadoPozicio + jatekterMeret;
        if (tamadoUjPozicio < jatekterMeret * jatekterMeret) {
            ujtamadok.push(tamadoUjPozicio);
            mezok[tamadoUjPozicio].classList.add("bombazoRepulo");
        } else {
            // Ha egy támadó eléri a jatéktér alját, a játék véget ér
            allapotJelzo.innerHTML = "A játék állapota: Vesztettél!";
            jatekVege = true;
            clearInterval(tamadoGeneralas);
            clearInterval(tamadoMozgatas);
            clearInterval(lezerMozgatasa);
            clearInterval(robbanasHozzaadas);
            clearInterval(jatekosMozgatas);

        }
    });
    tamadok = ujtamadok;
    tamadokKepHozzaad();
}

// Játékos lövése
function loves(e) {
    if (jatekVege) return; // Ha a játék véget ért, nincs lövés
    let lezer;
    let lezerPontosHelye = jatekoshelye;

    function lezerMozgatas() {
        mezok[lezerPontosHelye].classList.remove("lovedek");
        lezerPontosHelye -= jatekterMeret;

        if (lezerPontosHelye >= 0) {
            mezok[lezerPontosHelye].classList.add("lovedek");

            if (mezok[lezerPontosHelye].classList.contains("bombazoRepulo")) {
                mezok[lezerPontosHelye].classList.remove("lovedek");
                mezok[lezerPontosHelye].classList.remove("bombazoRepulo");
                const kep = mezok[lezerPontosHelye].querySelector("img");
                if (kep) {
                    mezok[lezerPontosHelye].removeChild(kep);
                }
                mezok[lezerPontosHelye].classList.add("robbanas");

                setTimeout(() => mezok[lezerPontosHelye].classList.remove("robbanas"), 300);
                clearInterval(lezer);

                const talalatHelye = tamadok.indexOf(lezerPontosHelye);
                if (talalatHelye > -1) {
                    tamadok.splice(talalatHelye, 1);
                }

                pontosEredmeny++;
                jelenlegiEredmeny.innerHTML = "Jelenlegi pontszám: " + pontosEredmeny;
                ellenorizEsFrissitMaxEredmeny();


                // DOMContentLoaded eseményhez hozzáadás a fetch-hez
                document.addEventListener("DOMContentLoaded", () => {
                    fetchMaxEredmenyFromDatabase();
                });

            }
        } else {
            clearInterval(lezer);
        }
    }

    if (e.key === "ArrowUp") {
        lezer = setInterval(lezerMozgatas, 100);
    }
}

// Játékos mozgatása
function jatekosMozgatasa(e) {
    if (jatekVege) return; // Ha a játék véget ért, nincs mozgás
    mezok[jatekoshelye].classList.remove("jatekosRepulo");
    switch (e.key) {
        case "ArrowLeft":
            if (jatekoshelye % jatekterMeret != 0) jatekoshelye -= 1;
            break;
        case "ArrowRight":
            if (jatekoshelye % jatekterMeret < jatekterMeret - 1) jatekoshelye += 1;
            break;
    }
    mezok[jatekoshelye].classList.add("jatekosRepulo");
}

function ujratoltes(e) {
    if (e.code === "Space") {
        location.reload();
    }
}

function updateMaxEredmenyInDatabase(maxEredmenyValue) {
    fetch('update_high_score.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ high_score: maxEredmenyValue }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Max eredmény frissítve az adatbázisban.');
        } else {
            console.error('Nem sikerült frissíteni a max eredményt:', data.message);
        }
    })
    .catch(error => {
        console.error('Hiba a max eredmény frissítésekor:', error);
    });
}

function fetchMaxEredmenyFromDatabase() {
    fetch('get_high_score.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const score = data.high_score || 0;
            maxEredmeny.textContent = "Legjobb pontszám: " + score;
        } else {
            console.error('Nem sikerült lekérni a max eredményt:', data.message);
        }
    })
    .catch(error => {
        console.error('Hiba a max eredmény lekérésekor:', error);
    });
}

function ellenorizEsFrissitMaxEredmeny() {
    const aktualis = pontosEredmeny;
    const jelenlegiMaxSzam = parseInt(maxEredmeny.textContent.replace(/\D/g, '')) || 0;

    if (aktualis > jelenlegiMaxSzam) {
        maxEredmeny.textContent = "Legjobb pontszám: " + aktualis;
        updateMaxEredmenyInDatabase(aktualis);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchMaxEredmenyFromDatabase();
});

// Képek eltávolításának rendszeres ellenőrzése
function kepTisztantart() {
    const kepTisztantartas = setInterval(() => {
        kepEltavolitas();

        if (jatekVege) {
            clearInterval(kepTisztantartas);
        }
    });
}
