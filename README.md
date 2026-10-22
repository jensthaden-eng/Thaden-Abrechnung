# Thaden BKA – Thaden Betriebskosten Abrechnung

Einsteiger-Grundgerüst für eine responsive Web-App zur Vorbereitung deutscher Betriebskostenabrechnungen.

## Enthalten
- Dashboard für Immobilien, Belege und Abrechnungsstatus
- Immobilien-/Wohnungsübersicht mit Beispieldaten
- Beleg-Upload für PDF/JPG/PNG (aktuell lokale Browser-Vorschau, noch keine dauerhafte Speicherung)
- Formular zur manuellen Prüfung erkannter Belegdaten
- Beispielrechnung für Kostenverteilung nach Wohnfläche
- CSV-Export der Beispielkosten

## Lokal starten
1. Node.js (LTS) installieren: https://nodejs.org/
2. Dieses Projekt entpacken.
3. Im Projektordner ein Terminal öffnen und ausführen:
   ```bash
   npm install
   npm run dev
   ```
4. Die angezeigte lokale Adresse im Browser öffnen.

## Auf GitHub hochladen
1. GitHub öffnen und ein neues Repository namens `thaden-bka` anlegen.
2. README, `.gitignore` und `package.json` können initialisiert werden; wenn du die ZIP hochlädst, erstelle das Repository am besten leer.
3. Entpacke die ZIP auf deinem PC.
4. Im Repository wähle **Add file → Upload files**, ziehe die entpackten Dateien und Ordner hinein und klicke **Commit changes**.

## Wichtig
Dies ist ein Prototyp, noch keine produktionsreife Abrechnungssoftware. Dateien und Daten werden nicht dauerhaft gespeichert; es gibt noch keine Anmeldung, Datenbank, echte OCR/KI-Integration oder geprüfte PDF-Abrechnung. Verwende vorerst keine echten Mieterdaten oder vertraulichen Belege. Vor produktivem Einsatz müssen Datenschutz, Sicherheit, Betriebskostenrecht, Umlageschlüssel und Rechenlogik fachlich geprüft werden.
