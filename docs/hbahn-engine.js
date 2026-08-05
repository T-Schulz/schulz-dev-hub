// Hilfsfunktion: Lineare Interpolation zwischen zwei GPS-Punkten
function interpolateCoords(p1, p2, fraction) {
    const lat = p1[0] + (p2[0] - p1[0]) * fraction;
    const lng = p1[1] + (p2[1] - p1[1]) * fraction;
    return [lat, lng];
}

// Hilfsfunktion: Berechnet exakte Position auf einem verschachtelten Linienzug (Polyline)
function getPositionOnRoute(coords, totalFraction) {
    if (totalFraction <= 0) return coords[0];
    if (totalFraction >= 1) return coords[coords.length - 1];

    const numSegments = coords.length - 1;
    const segmentFraction = 1 / numSegments;
    const targetSegment = Math.floor(totalFraction / segmentFraction);
    const remainder = (totalFraction % segmentFraction) / segmentFraction;

    return interpolateCoords(coords[targetSegment], coords[targetSegment + 1], remainder);
}

// Hauptfunktion zum Starten der Waggon-Animation
function initWaggonAnimation(map, routeCoords) {
    const hbahnIcon = L.divIcon({
        className: 'hbahn-icon',
        html: '🚟',
        iconSize:,
        iconAnchor: [11, 11]
    });

    const waggregateMarker = L.marker(routeCoords[0], { icon: hbahnIcon }).addTo(map);
    waggregateMarker.bindPopup("<b>H-Bahn Waggon (Linie 50)</b><br>Initialisiere...");

    function updateTrainPosition() {
        const jetzt = new Date();
        const sekundenSeitStunde = (jetzt.getMinutes() * 60) + jetzt.getSeconds();
        const umlaufZeitSekunden = 600; // 10-Minuten-Takt
        const fortschrittImUmlauf = sekundenSeitStunde % umlaufZeitSekunden;

        let aktuellePosition;
        let statusText = "";
        const statusElement = document.getElementById("mapStatus");

        if (fortschrittImUmlauf >= 0 && fortschrittImUmlauf < 120) {
            const prozent = fortschrittImUmlauf / 120;
            aktuellePosition = getPositionOnRoute(routeCoords, prozent);
            statusText = `Unterwegs nach: <b>Campus Süd</b><br>Ankunft in ca. ${Math.ceil(120 - fortschrittImUmlauf)} Sek.`;
            if (statusElement) {
                statusElement.innerHTML = "Leitstelle: Waggon auf Fahrt Richtung Campus Süd 🟢";
                statusElement.style.color = "#27ae60";
            }
        } else if (fortschrittImUmlauf >= 120 && fortschrittImUmlauf < 180) {
            aktuellePosition = routeCoords[routeCoords.length - 1];
            statusText = "Status: <b>Halt in Campus Süd</b><br>Fahrgastwechsel aktiv.";
            if (statusElement) {
                statusElement.innerHTML = "Leitstelle: Fahrgastwechsel Campus Süd 🟡";
                statusElement.style.color = "#f39c12";
            }
        } else if (fortschrittImUmlauf >= 180 && fortschrittImUmlauf < 300) {
            const prozent = (fortschrittImUmlauf - 180) / 120;
            const rueckfahrtCoords = [...routeCoords].reverse();
            aktuellePosition = getPositionOnRoute(rueckfahrtCoords, prozent);
            statusText = `Unterwegs nach: <b>Eichlinghofen</b><br>Ankunft in ca. ${Math.ceil(300 - fortschrittImUmlauf)} Sek.`;
            if (statusElement) {
                statusElement.innerHTML = "Leitstelle: Waggon auf Fahrt Richtung Eichlinghofen 🟢";
                statusElement.style.color = "#27ae60";
            }
        } else {
            aktuellePosition = routeCoords[0];
            const wartezeit = Math.ceil(600 - fortschrittImUmlauf);
            statusText = `Status: <b>Wartet in Eichlinghofen</b><br>Nächste Abfahrt in ${Math.floor(wartezeit/60)} Min. ${wartezeit%60} Sek.`;
            if (statusElement) {
                statusElement.innerHTML = "Leitstelle: Waggon abfahrbereit in Eichlinghofen 🔵";
                statusElement.style.color = "#2980b9";
            }
        }

        waggregateMarker.setLatLng(aktuellePosition);
        waggregateMarker.getPopup().setContent(`<h3>🚟 H-Bahn Wagen 04</h3>${statusText}`);
    }

    setInterval(updateTrainPosition, 500);
    updateTrainPosition();
}