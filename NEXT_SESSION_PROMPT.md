# Prompt für die nächste Session

Wir arbeiten weiter am "Game of Life" Projekt (React/Three.js). Der letzte Stand (Branch `adjust-sphere-distortion-and-controls-v2`) wurde in `main` gemerged, aber das Ergebnis ist visuell noch nicht perfekt.

**Aktuelle Baustellen:**

1.  **3D-Ansicht (Sphere Grid):**
    *   **Anforderung:** "Im Norden und Süden sollen die Quadrate kleiner und weniger werden."
    *   **Status:** Wir haben eine Skalierung (`scaleY`, `scaleX`) basierend auf dem Breitengrad implementiert. Das führt zu kleineren Quadraten, aber nicht zu *weniger* Quadraten (das Raster bleibt ein 2D-Array). Dadurch wirkt es an den Polen ggf. immer noch verzerrt oder zu dicht.
    *   **Aufgabe:** Analysiere `SphereGrid.tsx`. Finde eine visuelle Lösung, die die Zelldichte zu den Polen hin reduziert oder das Grid anders mappt, um den "Pol-Effekt" zu verbessern (z.B. Hexagonal-Mapping, Geodesic Sphere Ansatz oder Rendering-Tricks, die Zellen an den Polen ausblenden).

2.  **Rotation:**
    *   **Anforderung:** Extrem langsam und flüssig (~1 Quadrat pro Sekunde).
    *   **Status:** Die Geschwindigkeit wurde reduziert, aber muss final geprüft werden.

3.  **Mobile Controls:**
    *   **Anforderung:** Pfeile müssen *absolut* am Bildschirmrand kleben.
    *   **Status:** Wir nutzen `top-0`, `bottom-0` etc.
    *   **Aufgabe:** Prüfen, ob Padding im Container (`App.tsx`?) oder SafeArea die Pfeile nach innen drückt. Ggf. `fixed` statt `absolute` Positionierung testen.

**Code-Basis:**
*   `src/components/SphereGrid.tsx` (3D Logik)
*   `src/components/MobileControls.tsx` (Steuerung)
*   `src/App.tsx` (Layout)

Bitte setze diese visuellen Korrekturen um.
