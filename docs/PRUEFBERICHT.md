# Prüfbericht · 15.10.2026

## Umgebung

Node.js 24.19.0, npm 11.9.0, Linux, Chromium mit Software-WebGL. Keine externen Anwendungsanfragen, keine API-Schlüssel. Die Windows-Batchdateien sind vorhanden; eine Ausführung auf einem echten Windows-PC wurde nicht geprüft.

## Ergebnisse

| Prüfung | Ergebnis |
|---|---|
| Erneute Installation `npm ci --include=dev --no-audit --no-fund` | Erfolgreich, 193 Pakete |
| `npm test` | 16 Tests bestanden, keine ausgelassen |
| `npm run build` | TypeScript und Produktionsbuild erfolgreich |
| `npm run test:e2e` | 6 Browserabläufe bestanden, keine ausgelassen |
| Produktionsvorschau `npm run preview` | Funktionaler Browserlauf mit vier Ansichten bestanden |
| Node-Server ohne npm-Laufzeitabhängigkeiten | Funktionaler Browserlauf mit vier Ansichten bestanden |
| PNG | PNG-Signatur und Inhalt aus 3D und 2D geprüft |
| PDF | Gültiges dreiseitiges PDF; Raumflächen/-maße, Umlaute und Legende mit PyMuPDF gelesen, erste Seite visuell geprüft |
| GLB | glTF-2.0-Binärdatei; mit GLTFLoader wieder eingelesen, 49 Objektgruppen und Bettposition exakt erhalten, mehr als 500 räumliche Mesh-Instanzen |
| JSON | Export, validierter Import und geänderte Bettposition geprüft |
| Datenpipeline | Alle fünf erzeugten JSON-Dateien byte-identisch reproduzierbar |
| Quelldateien | SHA-256 identisch zu beiden hochgeladenen Originalen |

Die sechs Browserabläufe decken 3D/2D, Einzelraum, Rundgang, Quellenansicht, numerische Bearbeitung, freie Winkel/90°-Drehung, Undo/Redo, Sichtbarkeit, Persistenz nach Reload, bestätigten/abgebrochenen Reset, Ziehen in 2D und 3D, Kollisionswarnung, Hinzufügen/Entfernen, Kalibrierung bei gleichbleibenden Möbelmaßen, Bestandsschutz sowie sämtliche Exporttypen ab. Beim Startlauf wurden keine JavaScript-Fehler oder externen Netzwerkanfragen festgestellt.

Beim GLB werden Grundgeometrien wiederverwendet; deshalb gibt es weniger eindeutige Mesh-Definitionen als tatsächlich platzierte Bauteile. Entscheidend sind die transformierten Instanzen und vollständigen Objektgruppen. Diese wurden nach dem Einlesen geprüft.

## Grenzen und bekannte Befunde

- Sechs dokumentierte anfängliche Möbelkonflikte sind Planungsbefunde, keine fehlgeschlagenen Tests. Details in `REKONSTRUKTION.md`.
- Balkon und Treppenlandung weichen vom gedruckten Flächenwert ab; keine behauptete Vermessungsgenauigkeit.
- Rundungen nutzen konservative Kollisionshüllen. Bedienabstände, Türschwenkbereiche und Fluchtwege sind nicht automatisch bewertet.
- Vite meldet einen großen Haupt-Chunk (ca. 1,65 MB unkomprimiert / 480 KB gzip), wesentlich durch die 3D-Engine. Der Build ist erfolgreich. Es wurden keine FPS-Messungen auf Consumer-Hardware durchgeführt.
- Transparenter PNG-Hintergrund ist nicht implementiert. Der normale PNG-Export funktioniert.
- Die Cloud-Konfiguration enthält getestete Installations- und Startanweisungen als gespeicherten Entwurf. Veröffentlichung und Wiederherstellung in einer neuen Cloud-Aufgabe wurden nicht ausgeführt.
