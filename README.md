# Conway's Game of Life Project

Dieses Repository enthält eine moderne Web-Implementierung von Conway's Game of Life.

## Projektstruktur

- **[game-of-life/](./game-of-life/):** Der Haupt-Quellcode der Anwendung (React, TypeScript, Vite).
- **verification/:** Skripte zur Verifizierung und Tests.

## Hauptanwendung

Die vollständige Dokumentation, Installationsanweisungen und Details zu den Funktionen finden Sie im [Game of Life Verzeichnis](./game-of-life/README.md).

### Lokale Prüfungen

Für Änderungen gelten die Repository- und Git-Regeln aus der zentralen
[GIT_HANDOFF.md](https://github.com/rueeggaaron-sudo/orchestrator/blob/main/GIT_HANDOFF.md).
Verwendete und unterstützte Prüf-Runtime ist Node.js 22.12 oder 24; die
aktuelle lokale Referenz ist Node.js 22.23.4. Ein möglicher lokaler Pfad ist
`/Users/aaronrueegg/.bratman/runtimes/node22/bin`.

Installiere beide getrennt gelockten Pakete ohne Lifecycle-Skripte:

```bash
# Repository-Root
npm ci --ignore-scripts
# App-Paket
cd game-of-life
npm ci --ignore-scripts
npm test -- --run
cd ..
npm run lint
npm run build
```

Die Root-Installation hat ein `postinstall`, das sonst ein weiteres
`npm install` im App-Verzeichnis startet; deshalb ist `--ignore-scripts`
Bestandteil des reproduzierbaren Installationswegs. Die Unit-Tests liegen im
App-Paket. Das Root-Script `test:e2e` ist derzeit kein belegtes Gate: Im
Repository sind keine Playwright-Testdateien vorhanden. `npm audit
--audit-level=low` muss für Root und App separat ausgeführt und bewertet
werden; bekannte Befunde sind im Handoff dokumentiert und zählen nicht als
grüne Security-Prüfung.

### Schnellstart

1. In das Projektverzeichnis wechseln:
   ```bash
   cd game-of-life
   ```

2. Abhängigkeiten installieren und starten:
   ```bash
   npm ci --ignore-scripts
   npm run dev
   ```
