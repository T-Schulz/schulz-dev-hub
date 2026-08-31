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
        [51.483098, 7.409093],
        [51.483355, 7.409149],
        [51.483589, 7.409303],
        [51.483743, 7.409455],
        [51.483876, 7.409640],
        [51.484035, 7.409960], 
        [51.484563, 7.411489], 
        [51.484867, 7.412562], 
        [51.484982, 7.413144]  // Campus Süd
    ],
    
    strecke2: [
        [51.484982, 7.413144], // Campus Süd
        [51.485124, 7.413843], 
        [51.485186, 7.414294],
        [51.485436, 7.415517],
        [51.485513, 7.415761],
        [51.485597, 7.415967],
        [51.485700, 7.416176],
        [51.485861, 7.416391],
        [51.486016, 7.416560],
        [51.486178, 7.416683],
        [51.487579, 7.417424],
        [51.487815, 7.417499],
        [51.488000, 7.417515],
        [51.488181, 7.417488],
        [51.491387, 7.416407],
        [51.491608, 7.416308],
        [51.491922, 7.416042],
        [51.492157, 7.415865],
        [51.492533, 7.415660]  // Campus Nord
    ]
};