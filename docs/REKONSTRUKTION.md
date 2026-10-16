# Rekonstruktion und geometrische Unsicherheiten

## Quellen und Herkunft

Die 14 Seiten des Exposés wurden vollständig extrahiert. Seiten 2–5 betreffen Flächen, Ausstattung und Objektbeschreibung; sie liefern keine technischen Wandmaße. Seiten 6–12 enthalten Innen-/Außenfotos, Seite 13 den unbemaßten Grundriss, Seite 14 Kontaktdaten. Fotos von Außenansicht, Luftbildern und Ansprechpartnerin wurden berücksichtigt, liefern aber keine zusätzlichen belastbaren Innenmaße. Kontakttexte aus dem Exposé werden nicht als Handlungsauftrag behandelt.

Alle 32 eingebetteten Word-Bilder sind extrahiert. Bild 1 ist der Übersichtsgrundriss. Auf jedes Möbel-/Gruppenfoto folgt die jeweilige rote Positionsmarkierung. Bild 30 wird mehrfach für Waschmaschine und Trockner verwendet; die beiden Markierungen 31 und 32 unterscheiden die Räume. Das Schreibtischfoto ist Bild 28, seine Markierung 29; die Sofamarkierung ist 27. Diese Reihenfolge bleibt im Extraktionsprotokoll erhalten.

Die beiden Originaldateien sind unverändert. SHA-256:

- `Expose.pdf`: `bac5bf5ddb59e11cbc35cf5390f93ae197ee5082f5043c64d54755949b9b8e7a`
- `Möbel.docx`: `baad606981fc6f541bccd44baa83f0fb617037553fcfeb5108a2e406333d1b6e`

## Metrischer Maßstab

Koordinaten: X nach Osten, Y nach oben, Z nach Süden. Ursprung ist die innere nordwestliche Küchenecke. Einheiten durchgehend Meter. Möbelrotationen erfolgen um +Y; die Vorderseite eines ungedrehten Möbels zeigt nach +Z. Maßangaben in der Oberfläche werden in B/T/H normalisiert.

Die Pixelkonturen wurden an der auf 1888 × 1334 dargestellten Original-Grundrissgrafik nachgezeichnet. Die original extrahierte Datei hat 1920 × 1357 Pixel. Die Koordinatenbasis und Umrechnung sind im Datenmodell explizit gespeichert. Ein einziger Maßstabsfaktor `s` minimiert die Summe quadratischer Flächenfehler der sechs Innenräume: `s² = Σ(Pixelfläche × Quellenfläche) / Σ(Pixelfläche²)`. Ergebnis: etwa 0,00920643 Meter pro Koordinatenpixel. Keine unabhängige Verzerrung einzelner Räume.

| Raum | Exposé m² | Modell m² | Abweichung |
|---|---:|---:|---:|
| Küche | 17.9 | 17.993 | +0.5 % |
| Badezimmer | 6.5 | 6.607 | +1.6 % |
| Flur | 8.1 | 8.029 | -0.9 % |
| Wohnzimmer | 19.9 | 20.072 | +0.9 % |
| Schlafzimmer | 16.3 | 16.003 | -1.8 % |
| Büro / Kinderzimmer | 13.0 | 12.962 | -0.3 % |
| Treppenhaus | 2.9 | 2.521 | -13.1 % |
| Balkon | 8.8 | 6.825 | -22.4 % |

Balkon und Treppenlandung sind vom Maßstabsfit ausgeschlossen. Die sichtbare schmale Balkonkontur ergibt mit dem Innenraummaßstab nur ca. 6,83 m². Sie wurde nicht künstlich verlängert, um die gedruckten 8,8 m² zu erreichen. Eine Vermessung ist erforderlich, um diesen Quellenwiderspruch aufzulösen. Entsprechendes gilt für die 2,9-m²-Treppenlandung. Der im Bild gezeichnete eigentliche Treppenlauf ist davon getrennt. Die halbe Balkonfläche ist im Grundriss mit ca. 4,3 m² bezeichnet; diese Angaben sind keine belastbare Wohnflächenberechnung.

## Sichtbare bauliche Merkmale

- **Küche, S. 1:** Cremeweiße profilierte Fronten, holzfarbene Arbeitsflächen, grünliche Wangen/Halbinsel und Dunstabzug, helle Fliesen. Die U-ähnliche Zeile liegt im südwestlichen Küchenbereich gemäß Plan. Spüle, Kochfeld, Backofen, Geschirrspüler, Oberschrank und Halbinsel modelliert. Der Kühlschrank ist laut Text vorhanden, seine im Foto nicht eindeutig erkennbare Position ist als Annahme markiert.
- **Wohnzimmer, S. 6–7:** warmes Würfel-/Mosaikparkett, große Fensterfläche und Heizkörper. Balkonzugang seitlich im Südosten, nicht erfunden als zusätzliche Südtür.
- **Schlafzimmer, S. 8:** heller Holzfußboden, weiße Schrankfronten, Heizkörper neben Balkontür. Blickrichtung zur Südbalkontür setzt den rechts sichtbaren Schrank an die Westwand. Auch der Word-Grundriss zeigt den Schrank westlich. Der Exposé-Grundriss zeigt eine abweichende illustrative Möblierung; diese wird nicht als zusätzlicher Schrank übernommen.
- **Büro, S. 7:** heller Holzfußboden, Balkontür und hoher schmaler Heizkörper im südlichen Bereich.
- **Balkon, S. 9:** rötlich-braune Fliesen und horizontale hölzerne Brüstung. Drei Zugänge aus den drei südlichen Zimmern laut Fotos/Ausstattung. Kleine Sitzgruppe ist ausschließlich ein Planungsvorschlag.
- **Flur, S. 9/11:** heller Holzbelag und helle Wände. Details des Bogendurchgangs sind in einem rechteckigen Türportal angenähert; keine erfundene Zusatzwand.
- **Bad, S. 10–11:** graubeige Fliesen, Wand-WC vor Duschtrennwand, breites Waschbecken, dreigeteilter Spiegelschrank, Regendusche und zwei Fensterbereiche. Die Waschmaschine liegt links der Duschzone am markierten Anschlussbereich. Breiten, Trennwand und Montagehöhen geschätzt.

## Maßhierarchie und Annahmen

1. Auftraggeberkorrektur: Esstisch 72 cm hoch; KALLAX 75 cm breit und 147 cm hoch.
2. Word-Originalmaße bestimmen die unverzerrten Möbelabmessungen. Kommode 160 B × 50 T × 96 H; Schminktisch 110 B × 45 T × 75 H; HAUGA 70 B × 46 T × 199 H; Babybay 88 B × 46 T × 79 H; Stuhl 46 B × 50 T × 94 H. Die Originaltexte bleiben am Objekt.
3. Bauliche Konturen aus Exposé; Fotos bestimmen sichtbaren Bestand und Material.
4. Der zuletzt im Chat angehängte Nutzergrundriss bestimmt den aktuellen Originalzustand. Die Anpassungen in `src/data/original-layout.json` überschreiben die früheren Word-Aufstellungsbereiche bei der Datenerzeugung. Bildpositionen sind mit etwa ±3 cm Genauigkeit abgeleitet; Möbelgrößen bleiben unverändert. Die Word-Markierungen bleiben als historische Referenz erhalten.
5. Fehlende Maße werden als Annahmen gespeichert: Couchtisch Ø 70 cm / H 42 cm, Schreibtischhöhe 74 cm, Decke 250 cm. MALM 38 cm ist die Rahmenhöhe; Kopfteil 90 cm und Matratzenhöhe 18 cm sind gesonderte geometrische Annahmen. Lampen/Monitore/TV/Wickelauflage haben zusätzliche geschätzte Zubehörmaße.

Fenster-/Türbreiten sind aus der Zeichnung abgeleitet, Brüstungen und Öffnungshöhen geschätzt. Anschläge werden schematisch aus dem Plan interpretiert, nicht als vermessen bestätigt. Außenwandstärken ca. 26 cm und Innenwandstärken ca. 13–23 cm ergeben sich aus der Strichbreite; tatsächliche Material-/Putzschichten sind unbekannt. Wandhöhe 2,50 m bleibt editierbar.

## Originalzustand nach Nutzergrundriss

Der Nutzergrundriss (613 × 517 Pixel) ersetzt die frühere Ausgangsanordnung. Bett und Nachttische liegen an der Ostseite des Schlafzimmers, die Kommode weiter östlich an der Nordwand und das Babybay südlich des Bettes. Der Schminktisch steht an der Ostwand im Büro. SKRUVBY-Sideboard und -Schrank stehen im Wohnzimmer (West- bzw. Nordwand). Die Essgruppe ist nach Norden zusammengerückt; Ablagetisch und KALLAX im Flur wurden ebenfalls verschoben. Unveränderte Positionen, alle Möbelmaße und die Gebäudegeometrie werden übernommen.

Die Bildkoordinaten entsprechen näherungsweise einem Ursprung bei (16,5; 13,3) Pixel und 47,7 Pixel pro Meter. Die Positionen sind abgeleitet, kein Aufmaß. Das Bett steht mit einem Mittelpunkt von X = 7,09 m unmittelbar vor der östlichen Innenwand; dadurch wird eine allein durch Bildrundung verursachte Wanddurchdringung vermieden.

Neue Planungen und „Originalanordnung wiederherstellen“ verwenden diesen Stand. Gespeicherte Browserplanungen werden nicht automatisch überschrieben. Die Wiederherstellung kann rückgängig gemacht werden. `npm run data` berücksichtigt die Anpassungen erneut, damit sie bei einer späteren Datenerzeugung erhalten bleiben.

Der neue Originalzustand zeigt 0 Platzkonflikte in der Bauteilprüfung. Platzkonflikte werden weiterhin anhand der vollständigen 3D-Bauteile angezeigt. Die Prüfung berücksichtigt auch die eng an den Tisch geschobenen Stühle. Möbel werden dafür nicht verkleinert. Türschwenkbereiche, Sitz-/Bedienabstände und Fluchtwege sind nicht automatisch validiert.

Die Kollisionsprüfung arbeitet pro Bauteil, nicht nur mit einer einzigen Möbelhülle. Gedrehte Quader werden mit Separating Axis Theorem plus Höhenintervallen geprüft. Zylinder/Kugeln nutzen konservative umschließende Quader; dadurch sind kleine Fehlwarnungen an Rundungen möglich. Berührungen unter 3 mm werden toleriert. Zubehör innerhalb eines Möbelobjekts wird nicht gegeneinander geprüft. Zusammenhängende feste Einbauten sind als Bestand von gegenseitigen Konfliktwarnungen ausgenommen. Feste Einbauten gegen bewegliche Möbel und alle Wanddurchdringungen beweglicher Möbel werden geprüft.

Der vorhandene Schlafzimmerschrank bleibt seiner Herkunft nach Bestand, ist im Planer jedoch ein bewegliches Möbel. Er kann verschoben, gedreht, bearbeitet, kopiert und entfernt werden. Alte Speicherstände werden beim Laden ohne Verlust der übrigen Planung entsperrt.

## Vollständiges Inventar

Die folgende Liste verknüpft die Normalisierung mit dem extrahierten Referenzbild. Alle Objekte sind separat auswählbar; kontrolliertes Zubehör gehört zum jeweiligen Objekt.

| ID | Objekt | Raum | B × T × H (cm) | Quelle |
|---|---|---|---|---|
| daybed | HEMNES Tagesbett | office | 209 × 86 × 83 | /references/moebel-image2.png |
| dresser | HEMNES Kommode | bedroom | 160 × 50 × 96 | /references/moebel-image4.jpeg |
| bed | MALM Bett | bedroom | 196 × 209 × 38 | /references/moebel-image6.jpeg |
| bedside-1 | HEMNES Nachttisch 1 | bedroom | 46 × 35 × 70 | /references/moebel-image6.jpeg |
| bedside-2 | HEMNES Nachttisch 2 | bedroom | 46 × 35 × 70 | /references/moebel-image6.jpeg |
| billy-1 | BILLY / OXBERG 1 | living | 80 × 41 × 202 | /references/moebel-image8.jpeg |
| billy-2 | BILLY / OXBERG 2 | living | 80 × 41 × 202 | /references/moebel-image8.jpeg |
| besta | BESTÅ TV-Bank | living | 180 × 40 × 38 | /references/moebel-image10.jpeg |
| vanity | Schminktisch | office | 110 × 45 × 75 | /references/moebel-image12.jpeg |
| skruvby-side | SKRUVBY Sideboard | living | 120 × 38 × 90 | /references/moebel-image14.jpeg |
| skruvby-cab | SKRUVBY Schrank | living | 70 × 38 × 90 | /references/moebel-image14.jpeg |
| console | HEMNES Ablagetisch | hall | 157 × 40 × 74 | /references/moebel-image16.jpeg |
| kallax | KALLAX Regal | hall | 75 × 39 × 147 | /references/moebel-image18.jpeg |
| hauga | HAUGA Kleiderschrank | hall | 70 × 46 × 199 | /references/moebel-image20.png |
| babybay | Babybay Beistellbett | bedroom | 88 × 46 × 79 | /references/moebel-image22.png |
| dining | Esstisch | kitchen | 180 × 100 × 72 | /references/moebel-image24.jpeg |
| chair-1 | Esszimmerstuhl 1 | kitchen | 46 × 50 × 94 | /references/moebel-image24.jpeg |
| chair-2 | Esszimmerstuhl 2 | kitchen | 46 × 50 × 94 | /references/moebel-image24.jpeg |
| chair-3 | Esszimmerstuhl 3 | kitchen | 46 × 50 × 94 | /references/moebel-image24.jpeg |
| chair-4 | Esszimmerstuhl 4 | kitchen | 46 × 50 × 94 | /references/moebel-image24.jpeg |
| chair-5 | Esszimmerstuhl 5 | kitchen | 46 × 50 × 94 | /references/moebel-image24.jpeg |
| chair-6 | Esszimmerstuhl 6 | kitchen | 46 × 50 × 94 | /references/moebel-image24.jpeg |
| sofa-1 | Couchteil 1 · Ottomane | living | 110 × 180 × 70 | /references/moebel-image26.jpeg |
| sofa-2 | Couchteil 2 | living | 100 × 120 × 70 | /references/moebel-image26.jpeg |
| coffee | Runder Couchtisch | living | 70 × 70 × 42 | /references/moebel-image26.jpeg |
| desk | YASA Desk Pro | office | 160 × 80 × 74 | /references/moebel-image28.jpeg |
| dryer | Bosch Trockner | kitchen | 60 × 65 × 86 | /references/moebel-image30.jpeg |
| washer | Siemens Waschmaschine | bath | 60 × 60 × 86 | /references/moebel-image30.jpeg |
| kitchen-0 | Spülenzeile | kitchen | 145 × 60 × 90 | /references/expose-01-image-1.jpeg |
| kitchen-1 | Kochfeld / Backofen | kitchen | 72 × 60 × 90 | /references/expose-01-image-1.jpeg |
| kitchen-2 | Geschirrspüler | kitchen | 60 × 60 × 86 | /references/expose-01-image-1.jpeg |
| kitchen-3 | Arbeitsplatte am Fenster | kitchen | 60 × 50 × 90 | /references/expose-01-image-1.jpeg |
| kitchen-4 | Küchenhalbinsel | kitchen | 150 × 58 × 90 | /references/expose-01-image-1.jpeg |
| kitchen-5 | Kühlschrank (Position geschätzt) | kitchen | 60 × 65 × 185 | /references/expose-01-image-1.jpeg |
| kitchen-6 | Oberschrank | kitchen | 120 × 34 × 62 | /references/expose-01-image-1.jpeg |
| kitchen-7 | Dunstabzug | kitchen | 72 × 42 × 70 | /references/expose-01-image-1.jpeg |
| wardrobe | Vorhandener Kleiderschrank | bedroom | 260 × 60 × 240 | /references/expose-08-image-1.jpeg |
| basin | Waschbecken + Spiegelschrank | bath | 95 × 50 × 88 | /references/expose-10-image-1.jpeg |
| wc | Wand-WC | bath | 38 × 55 × 44 | /references/expose-10-image-2.jpeg |
| shower | Begehbare Dusche | bath | 92 × 185 × 210 | /references/expose-11-image-1.jpeg |
| radiator-0 | Heizkörper 1 | kitchen | 85 × 16 × 65 | /references/expose-01-image-1.jpeg |
| radiator-1 | Heizkörper 2 | kitchen | 85 × 16 × 65 | /references/expose-01-image-1.jpeg |
| radiator-2 | Heizkörper 3 | living | 220 × 16 × 55 | /references/expose-07-image-1.jpeg |
| radiator-3 | Heizkörper 4 | bedroom | 55 × 16 × 105 | /references/expose-08-image-1.jpeg |
| radiator-4 | Heizkörper 5 | office | 48 × 16 × 105 | /references/expose-07-image-2.jpeg |
| radiator-5 | Heizkörper 6 | hall | 85 × 16 × 60 | /references/expose-11-image-2.jpeg |
| balcony-table | Balkontisch · Vorschlag | balcony | 50 × 50 × 65 | Planungsannahme |
| balcony-chair-0 | Balkonstuhl 1 · Vorschlag | balcony | 45 × 50 × 85 | Planungsannahme |
| balcony-chair-1 | Balkonstuhl 2 · Vorschlag | balcony | 45 × 50 × 85 | Planungsannahme |
