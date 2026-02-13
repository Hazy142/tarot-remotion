# 📦 ASSETS SETUP GUIDE

## 🎨 Assets in den public/ Ordner kopieren

Ich habe die neuen Komponenten basierend auf deinen **echten Assets** erstellt! Jetzt musst du nur noch die Bilder in den richtigen Ordner kopieren:

## ✅ Schritt-für-Schritt Anleitung

### **1. Assets-Ordner öffnen**
Die hochgeladenen Dateien befinden sich vermutlich in deinem Downloads-Ordner oder wo auch immer du sie gespeichert hast.

### **2. Alle Bilder in public/ kopieren**

Kopiere **diese Dateien** in den Ordner:
```
D:\LunarLoom_Lab_André\lunarloom_Lab\tarot-remotion_v2\public\
```

**Liste der benötigten Dateien:**
- ✅ `cut_card_back.png` (Kartenrückseite)
- ✅ `Der_Narr_Illustration.png` (Narr-Illustration)
- ✅ `karriere.png` (Kompass-Icon)
- ✅ `karten_rahmen_video_transparent.png` (Arch-Rahmen + Ribbon)
- ✅ `kugel_v2.png` (Kristallkugel)
- ✅ `liebe.png` (Mond+Herz Icon)
- ✅ `planet.png` (Planet/Uranus Icon)
- ✅ `spiritualität.png` (Meditation Icon)
- ✅ `wind.png` (Wind/Luft Element Icon)

### **3. Prüfen ob alle da sind**

Öffne ein Terminal und führe aus:
```bash
cd D:\LunarLoom_Lab_André\lunarloom_Lab\tarot-remotion_v2
ls public/*.png
```

Du solltest **mindestens diese 9 Dateien** sehen:
```
public/cut_card_back.png
public/Der_Narr_Illustration.png
public/karriere.png
public/karten_rahmen_video_transparent.png
public/kugel_v2.png
public/liebe.png
public/planet.png
public/spiritualität.png
public/wind.png
```

---

## 🚀 Nach dem Kopieren

### **Remotion Studio starten:**
```bash
npm start
```

### **Composition auswählen:**
1. Öffne `AutoTarot-DerNarr`
2. Drücke Play ▶️

### **Was du sehen solltest:**
- ✅ Arch-Rahmen mit Ribbon oben
- ✅ Number Badge (0) oben mittig
- ✅ 2-Spalten Layout (Links: Kernbedeutung, Rechts: Kosmos)
- ✅ Wind + Planet Icons rechts
- ✅ 3 Icons unten (Liebe, Karriere, Spirituell)
- ✅ 2 Kristallkugeln ganz unten

---

## 🐛 Troubleshooting

### **Problem: "Cannot find module 'karten_rahmen_video_transparent.png'"**
**Lösung:** Du hast die Dateien nicht in den public/ Ordner kopiert. Siehe Schritt 2.

### **Problem: Icons sind unsichtbar**
**Lösung:** Prüfe ob die Dateinamen **exakt** übereinstimmen (inkl. Groß-/Kleinschreibung):
```bash
# Richtig:
wind.png

# Falsch:
Wind.png
WIND.PNG
wind.PNG
```

### **Problem: Arch-Rahmen passt nicht**
**Lösung:** Das Bild ist transparent - es sollte perfekt über die Karte passen. Falls nicht:
- Öffne `TarotOverlay.tsx`
- Passe die `height` im `.arch-frame-container` CSS an

---

## 📊 Was wurde geändert?

### **Alte Version (HTML-basiert):**
- ❌ SVG-Icons (handcodiert)
- ❌ CSS-Arch-Rahmen
- ❌ Ungenau

### **Neue Version (Asset-basiert):**
- ✅ PNG-Icons (deine echten Assets)
- ✅ PNG-Arch-Rahmen (exakt wie im Design)
- ✅ 100% Design-Match zu `video_UI_UX.png`

---

## ✨ Bereit zum Testen!

Sobald die Assets kopiert sind, sollte das Video **exakt** so aussehen wie in `video_UI_UX.png`! 🎬
