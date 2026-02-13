# ✅ Quick Start Checklist

## 🚦 Schritt-für-Schritt Start-Anleitung

### ☑️ **1. Dependencies prüfen**
```bash
cd D:\LunarLoom_Lab_André\lunarloom_Lab\tarot-remotion_v2
npm install
```

### ☑️ **2. Remotion Studio starten**
```bash
npm start
```
*→ Browser öffnet sich automatisch auf `http://localhost:3000`*

### ☑️ **3. Composition auswählen**
Im Studio:
1. Klicke auf Dropdown "Select a composition"
2. Wähle **`AutoTarot-DerNarr`**
3. Drücke Play ▶️

### ☑️ **4. Erste Preview ansehen**
Das Video sollte jetzt:
- ✅ Mit einem Flip der Karte starten
- ✅ Automatisch auf verschiedene Bereiche zoomen
- ✅ Audio abspielen
- ✅ Das mystische Overlay zeigen

---

## 🔍 Erste Tests

### **Test 1: Flip-Animation**
- Frame 0-120 (0-4 Sekunden)
- Die Karte sollte sich 1x drehen
- Von Rückseite zu Vorderseite

### **Test 2: Auto-Zoom auf Narrative**
- Suche im Audio nach "bedeutet" oder "symbolisiert"
- Die Kamera sollte auf die Narrative-Box zoomen

### **Test 3: Overlay Sichtbarkeit**
- Alle Elemente sollten sichtbar sein:
  - ✅ Goldener Arch-Rahmen
  - ✅ Ribbon mit "DER NARR • 0"
  - ✅ Kernbedeutung Box
  - ✅ 3 Icons (Liebe/Karriere/Spirituell)
  - ✅ 3 Kristallkugeln

---

## 🐛 Troubleshooting

### **Problem: "Cannot find module '../data/DerNarr_transcript.json'"**
**Lösung:** 
```bash
# Prüfe ob die Datei existiert:
ls src/data/DerNarr_transcript.json
```
Falls nicht vorhanden, erstelle einen Symlink:
```bash
cp public/DerNarr_transcript.json src/data/
```

### **Problem: Karte ist nicht im Arch-Fenster zentriert**
**Lösung:**
- Öffne `src/components/TarotAutoVideo.tsx`
- Passe `cardTopPercent` an (Zeile ~70):
```typescript
cardTopPercent={5.5}  // ← Erhöhe/Verringere diesen Wert
```

### **Problem: Audio spielt nicht**
**Lösung:**
- Prüfe ob `public/DerNarr_audio.mp3.mp3` existiert
- Falls nicht, benenne die Datei um oder passe den Pfad in `TarotAutoVideo.tsx` an

### **Problem: Overlay ist unsichtbar**
**Lösung:**
- Öffne Browser DevTools (F12)
- Prüfe Console auf Fehler
- Meist ist es ein CSS-Import Problem
- Stelle sicher dass `src/style.css` korrekt importiert wird in `src/index.ts`

---

## 🎨 Quick Tweaks

### **Kamera-Geschwindigkeit ändern:**
```typescript
// In src/utils/autoKeyframing.ts

// Langsamere Übergänge:
keyframes.push({
    timeInSeconds: time + 1.5, // ← Hier +1.5s Buffer hinzufügen
    zoom: POSITIONS.ICONS_LOVE.zoom,
    // ...
});
```

### **Farben anpassen:**
```css
/* In src/style.css */

:root {
    --gold-main: #FFD700; /* ← Helleres Gold */
    --bg-dark: #0a0510;   /* ← Dunklerer Background */
}
```

### **Flip-Speed ändern:**
```typescript
// In TarotAutoVideo.tsx

spinDurationFrames={90} // ← Schneller (3s statt 4s)
```

---

## 🎬 Video rendern

### **Einzelnes Video:**
```bash
npx remotion render AutoTarot-DerNarr output/der_narr.mp4
```

### **Mit höherer Qualität:**
```bash
npx remotion render AutoTarot-DerNarr output/der_narr_hd.mp4 --codec h264 --crf 18
```

### **Als MP4 für TikTok/Reels:**
```bash
npx remotion render AutoTarot-DerNarr output/der_narr_tiktok.mp4 \
  --codec h264 \
  --crf 23 \
  --audio-codec aac \
  --audio-bitrate 128k
```

---

## 🔄 Nächste Karte hinzufügen

1. **Audio erstellen:**
   - Datei: `public/DieMagier_audio.mp3`

2. **Whisper-Transkript generieren:**
   ```bash
   # Beispiel mit Whisper.cpp oder OpenAI API
   whisper --model medium --language de public/DieMagier_audio.mp3 \
     --output_format json \
     --output_dir src/data/
   ```

3. **Neue Composition erstellen:**
   - Dupliziere `TarotAutoVideo.tsx` zu `TarotAutoVideoTemplate.tsx`
   - Mache `cardId` zu einem Prop
   - In Root.tsx loop durch alle Karten

---

## ✨ Du bist ready!

Wenn alles funktioniert, solltest du jetzt:
1. ✅ Ein komplett automatisches Video sehen
2. ✅ Audio-synchronisierte Kamera-Bewegungen haben
3. ✅ Das mystische Design-Overlay sehen

**Next Level:** Automatisiere alle 78 Karten! 🚀
