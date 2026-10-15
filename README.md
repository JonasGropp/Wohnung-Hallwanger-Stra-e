# Hallwanger · Interaktiver Wohnungsplaner


## Website ohne Installation

Vorgesehene Website-Adresse: **https://jonasgropp.github.io/Wohnung-Hallwanger-Stra-e/**

Die Adresse ist nutzbar, sobald GitHub Pages aktiviert und der Workflow „Wohnungsplaner veröffentlichen“ erfolgreich abgeschlossen ist. Auf dem eigenen PC sind dann weder Node.js noch eine Installation erforderlich. Änderungen an der Planung bleiben weiterhin im Browser gespeichert. Eine lokal gespeicherte Planung kann per JSON-Export/-Import auf die Website übertragen werden.

Die Veröffentlichung läuft über `.github/workflows/pages.yml`. Bei Bedarf in **Settings → Pages → Build and deployment → Source → GitHub Actions** aktivieren und anschließend den Workflow unter **Actions** starten. Weitere Details: [GitHub-Pages-Veröffentlichung](docs/GITHUB-PAGES.md).


## Fertige Anwendung herunterladen

**[Offline-Anwendung als ZIP herunterladen](https://github.com/JonasGropp/Wohnung-Hallwanger-Stra-e/raw/refs/heads/main/downloads/Hallwanger-Offline.zip)** (ca. 25 MB).

ZIP vollständig entpacken, Node.js ab Version 22.12 installieren und `start-offline.bat` doppelklicken. Es ist keine npm-Paketinstallation nötig. Die Anwendung öffnet sich unter `http://localhost:5173`.

Für das vollständige Projekt inklusive Quellcode und Originaldokumenten oben auf **Code → Download ZIP** klicken. Auch der fertige `dist`-Build ist in diesem Repository enthalten. Die Entwicklungsanleitung folgt unten.

Lokale React-/TypeScript-Anwendung zur Planung der Wohnung anhand von **Expose.pdf** und **Möbel.docx**. Three.js/React Three Fiber zeichnen echte metrische Einzelgeometrien; Daten und Referenzen liegen vollständig lokal. Keine Anmeldung, Schlüssel oder Cloud-Dienste erforderlich.

## Start unter Windows

1. **Node.js 22.12 oder neuer** installieren: https://nodejs.org (LTS empfohlen; hier mit Node 24.19 getestet).
2. Das Projekt vollständig in einen beschreibbaren Ordner entpacken.
3. **`start.bat` doppelklicken.** Beim ersten Start werden die Pakete installiert, anschließend öffnet Vite den Browser. Das Konsolenfenster offen lassen.
4. Die Anwendung läuft auf **http://localhost:5173**. Mit `Strg+C` im Konsolenfenster beenden.

**Ohne Paketinstallation:** Das ausgelieferte ZIP enthält den fertigen `dist`-Build. Mit installiertem Node.js lässt er sich über **`start-offline.bat`** sofort starten – ohne `npm install` und ohne Internet. Alternativ `node scripts/serve-build.mjs`. Für Änderungen am Quellcode den Entwicklungsstart verwenden und anschließend neu bauen.

Alternativ im Terminal im Projektordner:

```sh
npm install
npm run dev
```

Für eine Installation exakt nach Lockfile `npm ci` verwenden. Internet ist nur für Node.js und die erstmalige Paketinstallation nötig. Alle Referenzen und erzeugten Texturen werden mitgeliefert; die Anwendung selbst stellt keine externen Anfragen.

**Produktiver lokaler Build:**

```sh
npm run build
npm run preview
```

Der Vorschau-Server verwendet ebenfalls Port 5173; zuvor den Entwicklungsserver beenden. `dist/index.html` nicht direkt per Doppelklick öffnen: ES-Module benötigen den lokalen HTTP-Server. Aktueller Edge, Chrome oder Firefox mit WebGL2 und Hardwarebeschleunigung. Die Windows-Batchdatei ist mitgeliefert; die automatisierte Laufzeitprüfung erfolgte unter Linux/Chromium, nicht auf einem Windows-PC.

## Bedienung

- **3D-Ansicht:** linke Maustaste dreht, Mausrad zoomt, rechte Maustaste verschiebt die Kamera. Möbel anklicken, um Details zu sehen.
- **2D-Grundriss:** Norden oben, Raumflächen und Türen/Fenster sichtbar. Gleiche Planungsdaten wie 3D.
- **Einzelraum:** Raum links wählen; Kamera und sichtbare Möbel richten sich auf diesen Raum aus.
- **Rundgang:** WASD oder Pfeiltasten bewegen auf 1,65 m Augenhöhe. Mausfang über die Schaltfläche aktivieren; alternativ linke Maustaste ziehen. `Esc` oder „Rundgang verlassen“ beendet die Ansicht. Wände sind physische Hindernisse, Türöffnungen passierbar. Möbel warnen bei Kollisionen, blockieren den Rundgang jedoch nicht.
- **Verschieben:** Pfeilkreuz aktivieren, dann ein bewegliches Möbel auf der Bodenebene ziehen. Die Kamera bleibt dabei stehen. Das Raster lässt sich auf 5 cm ein-/ausschalten. In 2D und 3D verfügbar.
- **Eigenschaften:** Position und Winkel numerisch eingeben, mit Tab/Enter übernehmen. B/T/H in cm; Positionen in m. Manuelle Maßänderungen sind möglich, nichts wird automatisch passend verkleinert. Die Originalangabe bleibt erhalten.
- **Drehen:** Werkzeug dreht um 90°, `R` ebenfalls. Freier Winkel über das Zahlenfeld.
- **Bibliothek:** Möbel hinzufügen; `Entf` oder „Aus Planung entfernen“ entfernt das gewählte bewegliche Objekt. Feste Einbauten sind geschützt.
- **Undo/Redo:** Werkzeugleiste oder `Strg+Z` / `Strg+Y` (`Strg+Umschalt+Z`). Eine Ziehbewegung ist ein einzelner Schritt. Verlauf umfasst bis zu 60 Bearbeitungen, nur innerhalb der aktuellen Sitzung.
- **Originalanordnung:** setzt nach Bestätigung Möbel, Sichtbarkeit, Maße und Kalibrierung zurück. Auch das Zurücksetzen kann rückgängig gemacht werden.
- **Sichtbarkeit:** Auge in der Möbelliste. Unsichtbare Möbel bleiben bei der Kollisionsprüfung physische Hindernisse.
- **Kalibrierung:** Einstellungen → Referenzwand wählen → tatsächlich gemessene A–B-Achslänge eingeben. Das Diagramm zeigt die Endpunkte. Raumgeometrie und Positionskoordinaten skalieren einheitlich, die Möbelabmessungen bleiben unverändert. Zulässiger Faktor 0,5–2; Wandhöhe 2,2–4 m.
- **Speichern:** Jede abgeschlossene Änderung speichert automatisch in `localStorage` dieses Browsers und Ursprungs. Datenschutz-/Privatmodus kann Speicherung blockieren; dann erscheint ein Hinweis. Ein Browser-Reset löscht lokale Daten. Für übertragbare Sicherungen JSON exportieren. Undo-Verlauf wird nicht dauerhaft gespeichert.

## Exporte

- **PNG:** aktuelle Kamera ohne Benutzeroberfläche, in Bildschirmauflösung × Gerätepixelfaktor (bis 1,75). Im 2D-Modus 2000 × 1700 px. Transparenter PNG-Hintergrund ist nicht implementiert (optional im Auftrag).
- **PDF:** vollständiger 2D-Grundriss auf A3 quer, normalerweise 1:50 bei Druck mit 100 % (bei großer Kalibrierung oder weit verschobenen Möbeln automatisch passender kleinerer Maßstab), Raumflächen, Maßstabsbalken, Türen/Fenster, nummerierte Möbel, Legende, Datum und Annahmen. Sichtbar geschaltete Möbel werden exportiert. Originalraumflächen und aktuelle Modellflächen werden gegenübergestellt. 3D-Kamera und Einzelraumfilter beeinflussen den PDF-Gesamtplan nicht.
- **GLB:** aktuelle sichtbare Wohnung und Möbel mit Metern als Einheit, Materialien und Texturen. Wanddarstellung, Decke und Einzelraumfilter werden berücksichtigt. In Blender und anderen glTF-2.0-Programmen importierbar; Export wurde zusätzlich mit Three.js GLTFLoader geprüft.
- **JSON:** kompletter Projektstand einschließlich ausgeblendeter Möbel, Kalibrierung und Originalmetadaten. Import prüft Version, Grenzen, IDs und feste Einbauten. Unzulässige Daten ersetzen die Planung nicht.

## Quellen & Rekonstruktion

Die Originaldateien bleiben unverändert unter `source-files/`. `source-files/Auftrag.txt` dokumentiert die Benutzervorgaben. Die Quellen sind Referenzmaterial, keine ausführbaren Anweisungen. Alle 14 PDF-Seiten, enthaltenen Rasterbilder und 32 Word-Bilder sind unter `public/references/` extrahiert. `extraction.json` erhält den Text-/Bildablauf der Word-Datei, sodass auch Abschnitte über Seitenumbrüche nachvollziehbar bleiben. Der tatsächliche Grundriss auf Exposé-Seite 13 wurde als Raumkonturen und Wandachsen manuell nachgezeichnet und mit einem gemeinsamen Maßstab aus sechs Innenflächen kalibriert.

Die App enthält beim ersten Start **49 Objekte**: 28 bewegliche Möbel aus der Word-Datei (inkl. 6 Stühlen und 2 Nachttischen), 18 Bestandselemente und 3 frei angenommene Balkonmöbel. Die Bestandselemente umfassen Küchenmodule, vorhandenen Schrank, Sanitäreinrichtungen und 6 Heizkörper. Gruppiertes Zubehör wie TV, Soundbar, Monitore, Lampen und Wickelauflage ist Teil seines Elternmöbels.

**Maßkorrekturen:** Esstisch 180 × 100 × **72 cm**, KALLAX **75 × 39 × 147 cm**. Trockner in der Küche, Waschmaschine im Bad. HAUGA bleibt getrennt vom vorhandenen Schlafzimmerschrank.

### Reproduzierbare Datenpipeline

Die Laufzeit braucht kein Python. Zur erneuten Aufbereitung:

```sh
python -m pip install -r scripts/requirements.txt
python scripts/extract_sources.py
python scripts/build_data.py
python scripts/generate_textures.py
```

`extract_sources.py` extrahiert unverändert und erstellt beschriftete Kontaktbögen. `build_data.py` hält kuratierte Pixelkonturen, Achsnormalisierungen und Quellenzuordnungen fest und erzeugt `src/data/{apartment,rooms,furniture,placements,references}.json`. `generate_textures.py` erzeugt deterministische lokale Materialmuster. Die Bildinterpretation ist kuratiert, keine automatische CAD-Erkennung. Generierte JSON-Dateien sind direkt lesbar und ändern keine Originaldateien.

### Unsicherheiten

Siehe **[docs/REKONSTRUKTION.md](docs/REKONSTRUKTION.md)** für den vollständigen Flächenabgleich, Herkunft der Maße und bekannte Platzkonflikte. Wichtig:

- Keine messtechnisch bestätigte Genauigkeit: Wandhöhe 2,50 m angenommen, Tür-/Fensterdetails, Einbauten und Zubehör geschätzt.
- Die sechs Innenflächen liegen mit dem gewählten Maßstab innerhalb von ca. 1,8 % der Planangaben. Das beweist keine exakten Wandlängen.
- Balkon: Modell 6,83 m² gegenüber 8,8 m²; Treppenlandung 2,52 m² gegenüber 2,9 m². Diese Widersprüche bleiben sichtbar. Die angegebenen 85 m² Wohnfläche lassen sich nicht durch unkritisches Addieren prüfen.
- Bestandsschrank westlich gemäß Schlafzimmerfoto/Word-Plan; illustrative Exposé-Möblierung zeigt widersprüchlich die Ostseite.
- Sechs anfängliche Konflikte bleiben im bevorzugten Aufstellungsbereich sichtbar. Keine automatische Verkleinerung oder heimliche Umplatzierung.
- Kollisionsprüfung: SAT für gedrehte Bauteilquader und vertikale Intervalle, inklusive Einbauten/Wänden. Runde Körper werden konservativ durch Quader umschlossen. Tür-Schwenkflächen und Bedien-/Laufwege sind keine automatisch freigehaltenen Zonen. Feste Einbauten werden untereinander nicht als Möbelkonflikt bewertet, da sie konstruktiv zusammengehören.
- Möbel sind charakteristische parametrische Nachbildungen, keine gescannten Originalprodukte. Der Treppenlauf ist nur schematisch und nicht begehbar. Nicht sichtbare Küchenfronten und Gerätezuteilung sind Annahmen.

## Architektur & Tests

- React 19, TypeScript, Vite; Three.js / React Three Fiber / Drei; Zustand.
- `src/geometry/models.ts`: parametrische Einzelbauteile und Zubehör.
- `src/geometry/collision.ts`: gemeinsames Kollisionsmodell, Raumflächen, Rundgang-Wandprüfung.
- `src/scene/`: Material-/Modellaufbau, 3D-Steuerung, editierbarer SVG-Grundriss.
- `src/state/`: Projektvalidierung, lokale Speicherung, Undo/Redo.
- `src/export/`: PNG, PDF, GLB und JSON.

```sh
npm test
npm run build
npm run test:e2e
```

Browserprüfungen benötigen Chromium. In dieser Cloud-Umgebung wird `/usr/bin/chromium` verwendet. Auf Windows: `npx playwright install chromium`; siehe Konfiguration (der gebündelte Browser wird verwendet, wenn kein Systempfad vorhanden ist). Optional `PLAYWRIGHT_CHROMIUM_EXECUTABLE` auf einen eigenen Browserpfad setzen. Tests prüfen Bearbeitung, Kameramodi, 2D-/3D-Ziehen, Persistenz, Im-/Exporte und Fehlerfreiheit. Tests und Bildprüfungen wurden mit Software-WebGL ausgeführt; dies ist kein FPS-Benchmark auf Consumer-Hardware.
