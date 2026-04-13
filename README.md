# 😮‍💨 oxy

**Angeleitete Atemübungen & Meditationen als Progressive Web App**

Oxy ist eine mobile-first PWA mit über 100 geführten Atemübungen und Meditationen – wissenschaftlich fundiert, sprachgeführt und ohne Account nutzbar.

---

## Features

- **Sprachführung** – jede Phase wird per Text-to-Speech angesagt (über vorgerenderte MP3s)
- **Animierte Atemführung** – Kreis, Box, Welle, Nasenloch-Visualisierung, Partikel u.v.m.
- **Favoriten** – Übungen markieren und schnell wiederfinden
- **Offline-fähig** – installierbar als PWA, funktioniert ohne Internetverbindung
- **Kein Account, keine Werbung, keine Tracker**

---

## Übungskategorien

| Kategorie | Beispiele |
|-----------|-----------|
| 😴 Einschlafen | 4-7-8 Atmung, Box Breathing, Mondatmung, Kohärentes Atmen |
| 🌿 Stressabbau | Physiologisches Seufzen, Wechselatmung, NSDR |
| 🕊️ Beruhigung | Vagus-Aktivierung, Panik-Stopp, Trauma-Release |
| ⚖️ Balance | Morgenmobilisierung, Energie-Balance, zirkadianer Reset |
| 🫀 Körper | Buteyko, Hypoxie-Training, Wim-Hof-Atmung |
| 🏃 Sport | Warm-up, Cool-down, Sprint-Recovery, Ausdauer-Atem |
| 🧘 Meditation | Loving-Kindness, Bergmeditation, Body-Scan, Traumreisen |

---

## Technik

Reines Vanilla-JS/HTML/CSS – kein Framework, kein Build-Step.

```
index.html        # Shell + Screens
app_data.js       # Alle Übungen als JS-Array (~100 Einträge)
css/              # Modulares CSS (variables, layout, cards, player, …)
audio/            # Vorgerenderte TTS-Audiodateien (MP3)
manifest.json     # PWA-Manifest
```

---

## Lokal starten

```bash
npx serve .
# oder
python3 -m http.server 8080
```

Dann `http://localhost:8080` im Browser öffnen. Für PWA-Installation muss HTTPS oder localhost verwendet werden.

---

## Audio generieren

Die Audiodateien wurden mit einem Python-Skript generiert:

```bash
python3 generate_audio.py
```

---

## Lizenz

Privates Projekt – alle Rechte vorbehalten.
