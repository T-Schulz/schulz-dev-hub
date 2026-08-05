// Globale GPS-Daten für die H-Bahn Dortmund
const hbahnData = {
    // Die 5 realen Haltestellen
    haltestellen: [
        { name: "🚟 H-Bahn Technologiezentrum", coords: [51.493336, 7.406970], info: "Endstation Nord-Ast" },
        { name: "🚟 H-Bahn Campus Nord", coords: [51.492533, 7.415660], info: "Zentraler Hauptknotenpunkt" },
        { name: "🚟 H-Bahn Dortmund Universität (S)", coords: [51.492321, 7.417398], info: "Anschluss S-Bahn S1" },
        { name: "🚟 H-Bahn Campus Süd", coords: [51.484982, 7.413144], info: "Knotenpunkt Süd-Ast" },
        { name: "🚟 H-Bahn Eichlinghofen", coords: [51.481511, 7.409145], info: "Endstation Süd-Ast" }
    ],

    // Deine präzise vermessene Strecke 1
    strecke1: [
        [51.481511, 7.409145], // Eichlinghofen
        [51.481865, 7.409188], 
        [51.482420, 7.409242], 
        [51.482921, 7.409099], 
        [51.483589, 7.409303], 
        [51.484035, 7.409960], 
        [51.484563, 7.411489], 
        [51.484867, 7.412562], 
        [51.484982, 7.413144]  // Campus Süd
    ]
};