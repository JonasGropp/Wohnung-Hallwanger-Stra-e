# Website mit GitHub Pages

Die Anwendung benötigt auf dem Gerät des Besuchers nur einen aktuellen Browser mit WebGL. Node.js wird ausschließlich auf dem GitHub-Runner zum Erstellen der statischen Website verwendet.

## Veröffentlichung

- Repository: `JonasGropp/Wohnung-Hallwanger-Stra-e`
- Workflow: `.github/workflows/pages.yml` – „Wohnungsplaner veröffentlichen“
- Zieladresse: `https://jonasgropp.github.io/Wohnung-Hallwanger-Stra-e/`
- Veröffentlichung: ausschließlich Inhalt von `dist`; kein Backend, kein Konto in der Anwendung.

GitHub Pages muss für das Repository aktiviert sein. Unter **Settings → Pages → Build and deployment → Source** die Option **GitHub Actions** auswählen. Falls GitHub für ein privates Repository einen anderen Tarif verlangt, ist dies eine Kontoeinstellung; das Repository wird durch die Einrichtung nicht automatisch öffentlich gemacht.

Der Workflow baut und testet Änderungen auf `main` automatisch und kann zusätzlich unter **Actions → Wohnungsplaner veröffentlichen → Run workflow** gestartet werden. Falls der erste Lauf vor der Pages-Aktivierung scheitert, nach Aktivierung erneut starten. Die Website ist erst nach einem erfolgreichen Deployment erreichbar; das bloße Vorhandensein der Workflow-Datei bestätigt noch keine Veröffentlichung.

## Dateipfade und Prüfung

Vite verwendet `base: './'`. Bilder, Referenzprotokoll und Three.js-Texturen werden über `src/utils/assets.ts` relativ zu dieser Basis geladen. Daten- und JSON-Projektdateien behalten ihre kanonischen Referenzpfade; dadurch bleiben bestehende lokale Planungen importierbar.

`tests/browser/pages.spec.ts` prüft den Produktionsbuild unter dem GitHub-Projektpfad. Der Testserver beantwortet Zugriffe auf versehentliche Root-Pfade mit 404. Geprüft werden 3D, alle Texturen, Referenzbilder, Quellenprotokoll, 2D und GLB-Export samt eingebetteten Bildern.

```sh
npm ci
npm test
npm run build
npm run test:e2e -- --grep GitHub-Pages-Unterpfad
```

Die lokale Variante bleibt über `start.bat` oder `start-offline.bat` nutzbar. Website und lokale Variante nutzen unterschiedliche Browser-Ursprünge und damit getrennte lokale Speicher. Planung bei Bedarf als JSON übertragen.
