// Funktion zum dynamischen Laden von JS-Skripten
function loadScript(url, callback) {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    script.onload = callback;
    document.head.appendChild(script);
}

// Wird aufgerufen, wenn der User den Button drückt
function erlaubeUndLadeKarte() {
    // 1. Statusanzeige updaten
    document.getElementById("mapStatus").innerHTML = "Status: Skripte werden geladen... ⏳";
    document.getElementById("mapStatus").style.color = "#007bff";

    // 2. Leaflet-Script-Pfad definieren
    const LeafletBasePath = "https://unpkg.com";

    // 3. Skript nachladen und Custom Elements initialisierung starten
    loadScript(`${LeafletBasePath}leaflet.js`, function() {
        
        // --- Custom-Element osm-map anlegen ---
        class osmMap extends HTMLElement {
            static get observedAttributes() { return ['topleft', 'bottomright']; }
            constructor() {
                super();
                const shadow = this.attachShadow({mode: 'closed'});
                this.mapcanvas = document.createElement('div');
                this.mapcanvas.className = "mapcanvas";
                shadow.appendChild(this.mapcanvas);

                const style1 = document.createElement('style');
                style1.textContent = `@import url('${LeafletBasePath}leaflet.css')`;
                shadow.appendChild(style1);

                const style2 = document.createElement('style');
                style2.textContent = `:host { display: block; } .mapcanvas { width: 100%; height: 100%; }`;
                shadow.appendChild(style2);
            }
            connectedCallback() {
                this.style.display = "block";
                this.mapcanvas.style.height = "100%";
                this.mapcanvas.style.width = "100%";
                this.makeMap();
            }
            attributeChangedCallback(name, oldValue, newValue) {
                if(this.map) {
                    let topleft = this.getAttribute("topleft").split(",").map(Number);
                    let bottomright = this.getAttribute("bottomright").split(",").map(Number);
                    this.map.fitBounds([ topleft, bottomright ]);
                }
            }
            makeMap() {
                let topleft = this.getAttribute("topleft").split(",").map(Number);
                let bottomright = this.getAttribute("bottomright").split(",").map(Number);
                const bounds = [ topleft, bottomright ];
                const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: 'Map data &copy; <a href="https://openstreetmap.org" target="_blank">OpenStreetMap</a>'
                });
                const map = L.map(this.mapcanvas, { layers: osm, tap: false });
                this.map = map;
                L.control.scale({imperial:false}).addTo(map);
                map.fitBounds(bounds);
                
                // Fix für fehlerhafte Kachel-Berechnungen beim verzögerten Laden
                setTimeout(() => { map.invalidateSize(); }, 200);

                map.on("resize", function(e){ map.fitBounds(bounds); });
            }
        }
        customElements.define('osm-map', osmMap);

        // --- Custom-Element osm-marker anlegen ---
        class osmMarker extends HTMLElement {
            static get observedAttributes() { return ['latlon', 'title', 'popup']; }
            constructor() { 
                super(); 
                L.Icon.Default.prototype.options.imagePath = `${LeafletBasePath}images/`; 
            }
            connectedCallback() {
                this.map = this.parentNode.map;
                if(this.map) { this.makeMarker(); }
            }
            makeMarker() {
                if(this.map) {
                    let latlon = this.getAttribute("latlon").split(",").map(Number);
                    let title = this.hasAttribute("title") ? this.getAttribute("title") : "";
                    let popup = this.hasAttribute("popup") ? this.getAttribute("popup") : null;
                    this.marker = L.marker(latlon,{title:title}).addTo(this.map);
                    if(popup) this.marker.bindPopup("<h3>"+title+"</h3>"+popup);
                }
            }
        }
        customElements.define('osm-marker', osmMarker);

        // 4. UI umschalten: Datenschutz-Box ausblenden, Karte einblenden
        document.getElementById("privacyNotice").style.display = "none";
        document.getElementById("meineKarte").style.display = "block";
        
        // Status aktualisieren
        document.getElementById("mapStatus").innerHTML = "Status: Dynamisches Leaflet aktiv ✔";
        document.getElementById("mapStatus").style.color = "#27ae60";
    });
}