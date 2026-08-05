// Globale Hilfsfunktionen für Geo-Interpolation
window.interpolateCoords = function(p1, p2, fraction) {
    const lat = p1 + (p2 - p1) * fraction;
    const lng = p1 + (p2 - p1) * fraction;
    return [lat, lng];
};

window.getPositionOnRoute = function(coords, totalFraction) {
    if (totalFraction <= 0) return coords;
    if (totalFraction >= 1) return coords[coords.length - 1];
    const numSegments = coords.length - 1;
    const segmentFraction = 1 / numSegments;
    const targetSegment = Math.floor(totalFraction / segmentFraction);
    const remainder = (totalFraction % segmentFraction) / segmentFraction;
    return window.interpolateCoords(coords[targetSegment], coords[targetSegment + 1], remainder);
};

// Startet den fahrplanmäßigen Waggon (10-Minuten-Takt)
window.initWaggonAnimation = function(map, routeCoords) {
    // REPARATUR: Größenangaben eingetragen, damit das Icon sichtbar ist!
    const icon = L.divIcon({ 
        className: 'hbahn-icon', 
        html: '🚟', 
        iconSize:, 
        iconAnchor: [12, 12] 
    });
    const marker = L.marker(routeCoords[0], { icon: icon }).addTo(map);
    marker.bindPopup("<b>🚟 Fahrplan-Waggon</b>");

    setInterval(() => {
        const jetzt = new Date();
        const sekunden = (jetzt.getMinutes() * 60) + jetzt.getSeconds();
        const fortschritt = sekunden % 600;
        let pos, text = "";

        if (fortschritt >= 0 && fortschritt < 120) {
            pos = window.getPositionOnRoute(routeCoords, fortschritt / 120);
            text = "Unterwegs nach: <b>Campus Süd</b>";
        } else if (fortschritt >= 120 && fortschritt < 180) {
            pos = routeCoords[routeCoords.length - 1];
            text = "Halt in <b>Campus Süd</b>";
        } else if (fortschritt >= 180 && fortschritt < 300) {
            const rueck = [...routeCoords].reverse();
            pos = window.getPositionOnRoute(rueck, (fortschritt - 180) / 120);
            text = "Unterwegs nach: <b>Eichlinghofen</b>";
        } else {
            pos = routeCoords[0];
            text = "Wartet in <b>Eichlinghofen</b>";
        }
        marker.setLatLng(pos);
        marker.getPopup().setContent(`<h3>🚟 Fahrplan-Waggon</h3>${text}`);
    }, 500);
};

// Startet den permanenten Express-Test-Waggon
window.initExpressDummyAnimation = function(map, routeCoords) {
    // REPARATUR: Größenangaben eingetragen, damit das Icon sichtbar ist!
    const icon = L.divIcon({ 
        className: 'hbahn-icon', 
        html: '🚀', 
        iconSize:, 
        iconAnchor: [12, 12] 
    });
    const marker = L.marker(routeCoords[0], { icon: icon }).addTo(map);
    marker.bindPopup("<b>🚀 Express-Test-Waggon</b>");

    let vorwaerts = true, fortschritt = 0;
    setInterval(() => {
        if (vorwaerts) { fortschritt += 0.005; if (fortschritt >= 1) vorwaerts = false; }
        else { fortschritt -= 0.005; if (fortschritt <= 0) vorwaerts = true; }
        const pos = window.getPositionOnRoute(routeCoords, fortschritt);
        marker.setLatLng(pos);
        marker.getPopup().setContent(`<h3>🚀 Express-Waggon</h3>Ziel: <b>${vorwaerts ? "Campus Süd" : "Eichlinghofen"}</b>`);
    }, 50);
};

// Aktiviert das Rechtsklick-Kopier-Werkzeug
window.activateGlobalRightClickLogger = function(map, textareaId) {
    const logger = document.getElementById(textareaId);
    if (!logger) return;
    map.on('contextmenu', (e) => {
        const chunk = `[${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}], // Klick-Punkt\n`;
        logger.value += chunk;
        navigator.clipboard.writeText(`[${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}]`);
    });
};