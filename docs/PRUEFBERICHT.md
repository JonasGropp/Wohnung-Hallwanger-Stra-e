# Prüfbericht · aktualisiert 16.10.2026

## Umgebung

Node.js 24.19.0, npm 11.9.0, Linux, Chromium mit Software-WebGL. Keine externen Anwendungsanfragen, keine API-Schlüssel. Die Windows-Batchdateien sind vorhanden; eine Ausführung auf einem echten Windows-PC wurde nicht geprüft.

## Ergebnisse

| Prüfung | Ergebnis |
|---|---|
| Erneute Installation `npm ci --include=dev --no-audit --no-fund` | Erfolgreich, 193 Pakete |
| `npm test` | 19 Tests bestanden, keine ausgelassen |
| `npm run build` | TypeScript und Produktionsbuild erfolgreich |
| `npm run test:e2e` | 7 Browserabläufe bestanden (einschließlich gezielter Wiederholungen), keine ausgelassen |
| Produktionsvorschau `npm run preview` | Funktionaler Browserlauf mit vier Ansichten bestanden |
| Node-Server ohne npm-Laufzeitabhängigkeiten | Funktionaler Browserlauf mit vier Ansichten bestanden |
| PNG | PNG-Signatur und Inhalt aus 3D und 2D geprüft |
| PDF | Gültiges PDF; Raumflächen/-maße, Umlaute und Legende mit PyMuPDF gelesen, erste Seite visuell geprüft |
| GLB | glTF-2.0-Binärdatei; mit GLTFLoader wieder eingelesen, 49 Objektgruppen und Bettposition exakt erhalten, mehr als 500 räumliche Mesh-Instanzen |
| JSON | Export, validierter Import und geänderte Bettposition geprüft |
| Datenpipeline | Alle fünf erzeugten JSON-Dateien byte-identisch reproduzierbar |
| Quelldateien | SHA-256 identisch zu beiden hochgeladenen Originalen |

Die sieben Browserabläufe decken 3D/2D, Einzelraum, Rundgang, Quellenansicht, numerische Bearbeitung, freie Winkel/90°-Drehung, Undo/Redo, Sichtbarkeit, Persistenz nach Reload, bestätigten/abgebrochenen Reset, Ziehen in 2D und 3D, Kollisionswarnung, Hinzufügen/Entfernen, Kalibrierung bei gleichbleibenden Möbelmaßen, Bestandsschutz sowie sämtliche Exporttypen ab. Beim Startlauf wurden keine JavaScript-Fehler oder externen Netzwerkanfragen festgestellt.

Beim GLB werden Grundgeometrien wiederverwendet; deshalb gibt es weniger eindeutige Mesh-Definitionen als tatsächlich platzierte Bauteile. Entscheidend sind die transformierten Instanzen und vollständigen Objektgruppen. Diese wurden nach dem Einlesen geprüft.

## Grenzen und bekannte Befunde

- Der neue Originalzustand nach dem Nutzergrundriss zeigt 0 Platzkonflikte. Die Bildableitung ist etwa ±3 cm genau; Details in `REKONSTRUKTION.md`.
- Balkon und Treppenlandung weichen vom gedruckten Flächenwert ab; keine behauptete Vermessungsgenauigkeit.
- Rundungen nutzen konservative Kollisionshüllen. Bedienabstände, Türschwenkbereiche und Fluchtwege sind nicht automatisch bewertet.
- Vite meldet einen großen Haupt-Chunk (ca. 1,65 MB unkomprimiert / 480 KB gzip), wesentlich durch die 3D-Engine. Der Build ist erfolgreich. Es wurden keine FPS-Messungen auf Consumer-Hardware durchgeführt.
- Transparenter PNG-Hintergrund ist nicht implementiert. Der normale PNG-Export funktioniert.
- Die Cloud-Konfiguration enthält getestete Installations- und Startanweisungen als gespeicherten Entwurf. Veröffentlichung und Wiederherstellung in einer neuen Cloud-Aufgabe wurden nicht ausgeführt.

## Nachprüfung des neuen Originalzustands

19 Möbelpositionen bzw. Ausrichtungen wurden nach dem Nutzerbild übernommen. Browserprüfung bestätigt den neuen Zustand beim Reset, Erhalt eigener gespeicherter Änderungen nach Reload und Wiederherstellung der vorherigen Planung per Undo. Der zusätzliche Produktionstest prüft Ressourcen und GLB-Export unter dem GitHub-Pages-Unterpfad. Die letzte gezielte Wiederholung von Reset/Persistenz, 3D-Ziehen/Rundgang und Pages-Test bestand vollständig (3/3); die übrigen vier Browserabläufe waren bereits erfolgreich.

Ein instabiler zugänglicher Buttonname bei Kollisionswarnungen wurde korrigiert: Möbel-Buttons behalten ihren Namen unabhängig vom Warnsymbol. Der abschließende Build ist erfolgreich. Die Beispielexporte, Ansichten und das geprüfte Offline-ZIP enthalten die neue Anordnung.

## Nachprüfung: beweglicher Schlafzimmerschrank

Der vorhandene Kleiderschrank ist jetzt beweglich. Die Herkunft bleibt „Bestand“. Bestehende Browserplanungen und ältere JSON-Dateien mit `fixed: true` werden gezielt für diesen Schrank entsperrt; Positionen, Kalibrierung und die übrigen Möbel bleiben erhalten. Andere Einbauten bleiben geschützt.

19 Fachtests und drei gezielte Browserabläufe bestanden: Migration eines alten Speicherstands mit geänderter Bettposition, Schrank per Maus verschieben, drehen, nach Reload erhalten, entfernen, rückgängig machen und Originalzustand wiederherstellen; außerdem Bestandsschutz/Kalibrierung und Produktionsbetrieb unter dem GitHub-Pages-Pfad mit GLB-Export. TypeScript und Produktionsbuild erfolgreich. Offline-Paket und JSON-Beispiel sind aktualisiert.
