# Conway's Game of Life

Eine moderne, responsive und interaktive Implementierung von Conway's Game of Life, entwickelt mit React, TypeScript und Tailwind CSS v4.

Dieses Projekt demonstriert zelluläre Automaten, bei denen komplexe Muster aus einfachen Regeln entstehen. Besonderer Fokus liegt auf einer **unendlichen Raster-Simulation** und **Echtzeit-Mustererkennung**.

## Funktionen

- **Unendliches Raster (Illusion):** Das Spielfeld ist nicht begrenzt. Durch Verschieben des sichtbaren Bereichs (Panning) entsteht der Eindruck einer unendlichen Welt. Zellen, die den sichtbaren Bereich verlassen, werden simuliert, solange sie aktiv sind (in der Logik des fixen Rasters, der verschoben wird).
- **Echtzeit-Mustererkennung:** Das System erkennt automatisch bekannte Strukturen (Still Lifes, Oscillators, Spaceships) und färbt sie entsprechend ein:
  - **Rot:** Block (Still Life)
  - **Gelb/Amber:** Beehive, Loaf (Still Life)
  - **Blau:** Pond (Still Life)
  - **Lila:** Blinker, Toad, Beacon (Oscillator)
  - **Grün:** Glider, LWSS (Spaceship)
- **Responsive Design:** Optimiert für Desktop und Mobile Geräte.
- **Steuerung:**
  - Start / Stop / Einzelschritt-Modus.
  - Geschwindigkeit anpassbar (50ms - 1000ms).
  - Zufälliges Feld generieren ("Zufall").
  - Feld leeren ("Leeren").
  - Vorgefertigte Muster laden (z.B. Glider, LWSS, Pulsar).
- **Statistiken:** Anzeige der aktuellen Generation und Anzahl lebender Zellen.
- **Intro Screen:** Erklärt die Regeln und die Faszination der Emergenz.

## Steuerung & Interaktion

### Desktop (Maus)
- **Linksklick:** Zelle umschalten (Zeichnen).
- **Rechtsklick + Ziehen:** Den sichtbaren Ausschnitt verschieben.
- **Mausrad:** Den sichtbaren Ausschnitt verschieben (horizontal/vertikal).

### Mobile (Touch)
- **Tippen:** Zelle umschalten.
- **Pfeiltasten-Overlay:** Den sichtbaren Ausschnitt verschieben.

## Die Regeln

1.  **Geburt:** Eine tote Zelle mit genau 3 lebenden Nachbarn wird lebendig.
2.  **Überleben:** Eine lebende Zelle mit 2 oder 3 lebenden Nachbarn bleibt am Leben.
3.  **Tod:** Eine lebende Zelle mit weniger als 2 oder mehr als 3 lebenden Nachbarn stirbt.

## Installation & Start

### Voraussetzungen

- Node.js (v18 oder höher empfohlen)
- npm

### Schritte

1.  Repository klonen:
    ```bash
    git clone <repository-url>
    cd game-of-life
    ```

2.  Abhängigkeiten installieren:
    ```bash
    npm install
    ```

3.  Entwicklungsserver starten:
    ```bash
    npm run dev
    ```
    Öffne [http://localhost:5173](http://localhost:5173) in deinem Browser.

## Build für Produktion

Um eine optimierte Version für das Deployment zu erstellen:

```bash
npm run build
```

Das Ergebnis liegt im `dist` Verzeichnis und kann auf jedem statischen Hoster (Vercel, Netlify, GitHub Pages) deployt werden.

## Video Referenz

Dieses Projekt basiert auf den Anforderungen aus folgendem Video:
[YouTube Link](https://youtu.be/TCLvGLA3WPM?si=-We4-WzZADlUSGRT)

## Technologien

- **React 19**
- **TypeScript**
- **Vite**
- **Tailwind CSS v4**
