// ==========================================
// 1. BADGES/LOGOS GENERIEREN (Original-Trick)
// ==========================================
const basisUrl = "https://" + "img." + "shields" + ".io/badge/";

const technologien = [
    { name: "Python", farbe: "3776AB", logo: "python" },
    { name: "GIT", farbe: "F05032", logo: "git" },
    { name: "Visual_Studio_Code", farbe: "007ACC", logo: "visual-studio-code" },
    { name: "Markdown", farbe: "000000", logo: "markdown" },
    { name: "HTML5", farbe: "E34F26", logo: "html5" },
    { name: "CSS3", farbe: "1572B6", logo: "css3" },
    { name: "Leaflet", farbe: "199900", logo: "leaflet" }
];

const badgeContainer = document.getElementById("dynamicBadges");

technologien.forEach(tech => {
    const img = document.createElement("img");
    img.className = "badge";
    img.alt = tech.name;
    img.src = basisUrl + tech.name + "-" + tech.farbe + "?style=flat&logo=" + tech.logo + "&logoColor=white";
    badgeContainer.appendChild(img);
});


// ==========================================
// 2. SMART CITY LEITSTELLE (Karten-Logik)
// ==========================================
const kachelUrl = "https://" + "{s}." + "tile." + "openstreetmap." + "org/{z}/{x}/{y}.png";
const dortmundApiUrl = "https://" + "dortmund." + "opendatasoft." + "com/api/explore/v2.1/catalog/datasets/parkplatzsensoren/records?limit=25";

// Karte aufbauen und auf Dortmund zentrieren
var map = L.map('map').setView([51.5136, 7.4653], 13);

L.tileLayer(kachelUrl, {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Offline-Pufferdaten für den Schutz vor lokalen Ladeblockaden
const pufferSensoren = [
    { lat: 51.5142, lon: 7.4661, name: "Stellplatz Wallring (Backup)", status: "frei" },
    { lat: 51.5121, lon: 7.4612, name: "Stellplatz Hauptbahnhof (Backup)", status: "belegt" },
    { lat: 51.5175, lon: 7.4710, name: "Stellplatz Reinoldikirche (Backup)", status: "frei" }
];

function platziereMarker(lat, lon, titel, stand) {
    L.marker([lat, lon]).addTo(map)
     .bindPopup("<b>" + titel + "</b><br>Status: " + stand.toUpperCase());
}

async function ladeParksensoren() {
    const statusLabel = document.getElementById("mapStatus");
    try {
        const response = await fetch(dortmundApiUrl);
        if (!response.ok) throw new Error();
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            data.results.forEach(record => {
                if (record.geo_point_2d) {
                    platziereMarker(
                        record.geo_point_2d.lat, 
                        record.geo_point_2d.lon, 
                        record.parking_space_name || "IoT Stellplatz", 
                        record.status || "unbekannt"
                    );
                }
            });
            statusLabel.innerText = "Status: Live-Daten erfolgreich geladen ✔ (v4.0.0)";
            statusLabel.style.color = "#27ae60";
        } else {
            throw new Error();
        }
    } catch (error) {
        console.warn("API blockiert. Setze Puffer-Marker.");
        pufferSensoren.forEach(p => platziereMarker(p.lat, p.lon, p.name, p.status));
        statusLabel.innerText = "Status: API offline - Backup-Puffer aktiv ⚠️ (v4.0.0)";
        statusLabel.style.color = "#e67e22";
    }
}

ladeParksensoren();


// ==========================================
// 3. DARK MODE TOGGLE (Modus-Wechsler)
// ==========================================
const btn = document.getElementById("themeToggle");

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute("data-theme", "dark");
}

btn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    setTimeout(() => { map.invalidateSize(); }, 200);
});