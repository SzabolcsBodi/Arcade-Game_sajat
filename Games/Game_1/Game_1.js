// változók
const jatekter = document.querySelector(".jatekter");
const eredmenyJelzo = document.querySelector(".eredmeny");
const szelesseg = 15;
const magassag = 15;
let jatekoshelye = 202;
let tamadok = [];
let pontosEredmeny = 0;
let jatekVege = false;
let jatekVegePontszam = 5

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
    const kiIndulasiHely = Math.floor(Math.random() * szelesseg);
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

        const tamadoUjPozicio = tamadoPozicio + szelesseg;
        if (tamadoUjPozicio < szelesseg * magassag) {
            ujtamadok.push(tamadoUjPozicio);
            mezok[tamadoUjPozicio].classList.add("bombazoRepulo");
        } else {
            // Ha egy támadó eléri a jatéktér alját, a játék véget ér
            eredmenyJelzo.innerHTML = "Vesztettél!";
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
        lezerPontosHelye -= szelesseg;

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
                eredmenyJelzo.innerHTML = pontosEredmeny;

                if (pontosEredmeny == jatekVegePontszam) { // Győzelem ellenőrzése
                    eredmenyJelzo.innerHTML = "Nyertél!";
                    jatekVege = true; // Játék véget ért
                    clearInterval(tamadoGeneralas);
                    clearInterval(tamadoMozgatas);
                    clearInterval(lezerMozgatasa);
                    clearInterval(robbanasHozzaadas);
                    clearInterval(jatekosMozgatas);
                }
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
            if (jatekoshelye % szelesseg != 0) jatekoshelye -= 1;
            break;
        case "ArrowRight":
            if (jatekoshelye % szelesseg < szelesseg - 1) jatekoshelye += 1;
            break;
    }
    mezok[jatekoshelye].classList.add("jatekosRepulo");
}

// Képek eltávolításának rendszeres ellenőrzése
function kepTisztantart() {
    const kepTisztantartas = setInterval(() => {
        kepEltavolitas();

        if (pontosEredmeny == jatekVegePontszam) {
            clearInterval(kepTisztantartas);
        }
    });
}

// Időzítők a támadók generálására és mozgatására
const tamadoGeneralas = setInterval(tamadokLetrehozasa, 1250); // 1.25 másodpercenként új támadó
const tamadoMozgatas = setInterval(tamadokMozgatasa, 1250); // 1.25 másodpercenként mozognak lejjebb
const lezerMozgatasa = setInterval(lezerKepHozzaad, 100);
const robbanasHozzaadas = setInterval(robbanasKepHozzaad, 300)
const jatekosMozgatas = setInterval(jatekosKepHozzaad, 1)
const kepTisztantarto = setInterval(kepTisztantart, 1)

document.addEventListener("keydown", jatekosMozgatasa);
document.addEventListener("keydown", loves);

// Létrehozza a játéktér elemeit
for (let i = 0; i < szelesseg * magassag; i++) {
    const jatekMezo = document.createElement("div");
    jatekter.appendChild(jatekMezo);
}
const mezok = Array.from(document.querySelectorAll(".jatekter div"));

// A játékos inicializálása
mezok[jatekoshelye].classList.add("jatekosRepulo");