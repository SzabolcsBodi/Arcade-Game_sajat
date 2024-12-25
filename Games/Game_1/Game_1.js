// változók
const jatekter = document.querySelector(".jatekter");
const allapotJelzo = document.querySelector(".allapotJelzo");
const jelenlegiEredmeny = document.querySelector(".jelenlegiEredmeny");
const legutobbiEredmeny = document.querySelector(".legutobbiEredmeny")
const maxEredmeny = document.querySelector(".maxEredmeny");
const NehezsegMutato = document.querySelector(".NehezsegMutato")
const szelesseg = 15;
const magassag = 15;
let jatekoshelye = 202;
let tamadok = [];
let pontosEredmeny = 0;
let jatekVege = false;
let sebesseg = ((localStorage.getItem("sebesseg") == null) ? 1000 : localStorage.getItem("sebesseg"))
localStorage.setItem("sebesseg", sebesseg)

legutobbiEredmeny.innerHTML = "Legutóbbi pontszám: " + ((localStorage.getItem("legutobbi") == null) ? "Nincs adat" : localStorage.getItem("legutobbi"));
maxEredmeny.innerHTML = "Maximum pontszám: " + ((localStorage.getItem("max") == null) ? "Nincs adat" : localStorage.getItem("max"));
NehezsegMutato.innerHTML = "Jelenlegi nehézség: " + nehezsegKiValasztas()

// Időzítők a támadók generálására és mozgatására
const tamadoGeneralas = setInterval(tamadokLetrehozasa, sebesseg);
const tamadoMozgatas = setInterval(tamadokMozgatasa, sebesseg);
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
            allapotJelzo.innerHTML = "A játék állapota: Vesztettél!";
            jatekVege = true;
            clearInterval(tamadoGeneralas);
            clearInterval(tamadoMozgatas);
            clearInterval(lezerMozgatasa);
            clearInterval(robbanasHozzaadas);
            clearInterval(jatekosMozgatas);

            localStorage.setItem("legutobbi", pontosEredmeny);
            
            try {

                if (pontosEredmeny == 0) {
                    localStorage.setItem("max", pontosEredmeny);
                }

                if (pontosEredmeny > localStorage.getItem("max")) {
                    localStorage.setItem("max", pontosEredmeny);
                }

            } catch (error) {
                console.log("Hiba a local strorage elérésekor");
            }

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
                jelenlegiEredmeny.innerHTML = "Jelenlegi pontszám: " + pontosEredmeny;

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

        if (jatekVege) {
            clearInterval(kepTisztantartas);
        }
    });
}

function torles() {
    localStorage.removeItem("legutobbi")
    localStorage.removeItem("max")
    //localStorage.clear()
    location.reload()
}

function nehezsegBekeres() {

    let nehezseg = prompt("Milyen legyen a lehézség? (Könnyű, Közepes, Nehéz)")

    switch (nehezseg) {
        case "Könnyű":
            sebesseg = 1250;
            localStorage.setItem("sebesseg", 1250)
            break;
        case "Közepes":
            sebesseg = 1000;
            localStorage.setItem("sebesseg", 1000)
            break;
        case "Nehéz":
            sebesseg = 750;
            localStorage.setItem("sebesseg", 750)
            break;
        default:
            alert("Kérlek a felkínált lehetőségek közül válasz!")
            nehezsegBekeres()
    }

}

function nehezsegKiValasztas() {

    let eredmeny;

    switch (localStorage.getItem("sebesseg")) {
        case "1250":
            eredmeny = "Könnyű"
            return eredmeny;
        case "1000":
            eredmeny = "Közepes"
            return eredmeny;
        case "750":
            eredmeny = "Nehéz"
            return eredmeny;
    }
}

function nehezsegAtalitas() {
    nehezsegBekeres()
    console.log(sebesseg)
    location.reload()
}
