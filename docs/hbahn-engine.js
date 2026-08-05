// Hilfsfunktion: Lineare Interpolation zwischen zwei GPS-Punkten
function interpolateCoords(p1, p2, fraction) {
    const lat = p1[0] + (p2[0] - p1[0]) * fraction;
    const lng = p1[1] + (p2[1] - p1[1]) * fraction;
    return [lat, lng];
}

// Hilfsfunktion: Berechnet exakte Position auf einem Linienzug (Polyline)
function getPositionOnRoute(coords, totalFraction) {
    if (totalFraction <= 0) return coords[0];
    if (totalFraction >= 1) return coords[coords.length - 1];

    const numSegments = coords.length - 1;
    const segmentFraction = 1 / numSegments;
    const targetSegment = Math.floor(totalFraction / segmentFraction);
    const remainder = (totalFraction % segmentFraction) / segmentFraction;

    return interpolateCoords(coords[targetSegment], coords[targetSegment + 1], remainder);
}

// ====================================================================
// FAHRPLAN-WAGGON (Echtzeit-Uhrzeit-Kopplung)
// ====================================================================
function initWaggonAnimation(map, routeCoords) {
    // REPARATUR: Pixel-Größen (24x24) eingetragen, um Absturz zu verhindern!
    const hbahnIcon = L.divIcon({
        className: 'hbahn-icon',
        html: '🚟',
        iconSize:,
        iconAnchor: [12, 12]
    });

    const waggregateMarker = L.marker(routeCoords[0], { icon: hbahnIcon }).addTo(map);
    waggregateMarker.bindPopup("<b>H-Bahn Waggon (Fahrplan)</b><br>Berechne...");

    function updateTrainPosition() {
        const jetzt = new Date();
        const sekundenSeitStunde = (jetzt.getMinutes() * 60) + jetzt.getSeconds();
        const umlaufZeitSekunden = 600; 
        const fortschrittImUmlauf = sekundenSeitStunde % umlaufZeitSekunden;

        let aktuellePosition;
        let statusText = "";
        const statusElement = document.getElementById("mapStatus");

        if (fortschrittImUmlauf >= 0 && fortschrittImUmlauf < 120) {
            const prozent = fortschrittImUmlauf / 120;
            aktuellePosition = getPositionOnRoute(routeCoords, prozent);
            statusText = `Unterwegs nach: <b>Campus Süd</b><br>Ankunft in ca. ${Math.ceil(120 - fortschrittImUmlauf)} Sek.`;
            if (statusElement) statusElement.innerHTML = "Leitstelle: Waggon fahrplanmäßig unterwegs... 🟢";
        } else if (fortschrittImUmlauf >= 120 && fortschrittImUmlauf < 180) {
            aktuellePosition = routeCoords[routeCoords.length - 1];
            statusText = "Status: <b>Halt in Campus Süd</b><br>Fahrgastwechsel aktiv.";
            if (statusElement) statusElement.innerHTML = "Leitstelle: Fahrgastwechsel am Campus 🟡";
        } else if (fortschrittImUmlauf >= 180 && fortschrittImUmlauf < 300) {
            const prozent = (fortschrittImUmlauf - 180) / 120;
            const rueckfahrtCoords = [...routeCoords].reverse();
            aktuellePosition = getPositionOnRoute(rueckfahrtCoords, prozent);
            statusText = `Unterwegs nach: <b>Eichlinghofen</b><br>Ankunft in ca. ${Math.ceil(300 - fortschrittImUmlauf)} Sek.`;
            if (statusElement) statusElement.innerHTML = "Leitstelle: Waggon fahrplanmäßig unterwegs... 🟢";
        } else {
            aktuellePosition = routeCoords[0];
            const wartezeit = Math.ceil(600 - fortschrittImUmlauf);
            statusText = `Status: <b>Wartet in Eichlinghofen</b><br>Nächste Abfahrt in ${Math.floor(wartezeit/60)} Min.`;
            if (statusElement) statusElement.innerHTML = "Leitstelle: Waggon wartet in Endstation 🔵";
        }

        waggregateMarker.setLatLng(aktuellePosition);
        waggregateMarker.getPopup().setContent(`<h3>🚟 Fahrplan-Waggon</h3>${statusText}`);
    }

    setInterval(updateTrainPosition, 500);
    updateTrainPosition();
}

// ====================================================================
// PERMANENTER EXPRESS-DUMMY-WAGGON (Pendelt ohne Pause durch)
// ====================================================================
function initExpressDummyAnimation(map, routeCoords) {
    // REPARATUR: Pixel-Größen (24x24) eingetragen!
    const dummyIcon = L.divIcon({
        className: 'hbahn-icon',
        html: '🚀', 
        iconSize:,
        iconAnchor: [12, 12]
    });

    const dummyMarker = L.marker(routeCoords[0], { icon: dummyIcon }).addTo(map);
    dummyMarker.bindPopup("<h3>🚀 Express-Test-Waggon</h3>Pendelt ununterbrochen.");

    let vorwaerts = true;
    let fortschritt = 0;

    function updateExpressPosition() {
        if (vorwaerts) {
            fortschritt += 0.005;
            if (fortschritt >= 1) { fortschritt = 1; vorwaerts = false; }
        } else {
            fortschritt -= 0.005;
            if (fortschritt <= 0) { fortschritt = 0; vorwaerts = true; }
        }

        const aktuellePosition = getPositionOnRoute(routeCoords, fortschritt);
        dummyMarker.setLatLng(aktuellePosition);
        
        // REPARATUR: Anführungszeichen korrigiert
        const ziel = vorwaerts ? "Campus Süd" : "Eichlinghofen";
        dummyMarker.getPopup().setContent(`<h3>🚀 Express-Test-Waggon</h3>Pendelt im Dauertest.<br>Ziel: <b>${ziel}</b>`);
    }

    setInterval(updateExpressPosition, 100);
}

// ====================================================================
// GLOBALES RECHTSKLICK-KOORDINATEN-WERKZEUG
// ====================================================================
function activateGlobalRightClickLogger(map, textareaId) {
    const loggerTextarea = document.getElementById(textareaId);
    if (!loggerTextarea) return;

    map.on('contextmenu', function(e) {
        const lat = e.latlng.lat.toFixed(6);
        const lng = e.latlng.lng.toFixed(6);
        const formattedString = `[${lat}, ${lng}], // Klick-Punkt\n`;
        
        loggerTextarea.value += formattedString;
        
        navigator.clipboard.writeText(`[${lat}, ${lng}]`).then(() => {
            const statusElement = document.getElementById("mapStatus");
            if (statusElement) {
                const alterText = statusElement.innerHTML;
                statusElement.innerHTML = `📋 Koordinaten kopiert: [${lat}, ${lng}]!`;
                setTimeout(() => { statusElement.innerHTML = alterText; }, 1500);
            }
        });
    });
}