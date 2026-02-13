# 🌙 LunarLoom - Automatisierte Tarot-Video-Generierung

## ✨ Was wurde implementiert?

### 🎯 **Vollautomatisches Video-System**

Ich habe das komplette Auto-Keyframing-System für deine Tarot-Videos implementiert! 

## 📂 Neue Dateien

### 1. **TarotOverlay.tsx** ✅
```
src/components/TarotOverlay.tsx
```
- **Funktion**: Das mystische Design-Overlay aus deinen HTML-Vorlagen
- **Features**:
  - Goldener Arch-Rahmen
  - Ribbon mit Kartentitel
  - Narrative Box (Kernbedeutung)
  - Icon-Trio (Liebe, Karriere, Spirituell)
  - Kristallkugeln (Schattenseite)
  - Corner Ornaments
  - Bottom Star

### 2. **autoKeyframing.ts** ✅
```
src/utils/autoKeyframing.ts
```
- **Funktion**: Das GEHIRN des Systems
- **Features**:
  - Scannt Whisper-Transkripte nach Keywords
  - Generiert automatisch Kamera-Keyframes
  - Keyword-Matching für:
    - Intro → Zoom auf Karte
    - "Bedeutet" → Zoom auf Narrative
    - "Liebe" → Zoom auf Liebe-Icon
    - "Karriere" → Zoom auf Karriere-Icon
    - "Spirituell" → Zoom auf Spirituell-Icon
    - "Schatten/Warnung" → Zoom auf Kristallkugeln
  - Debug-Funktion `debugKeyframeGeneration()`

### 3. **TarotAutoVideo.tsx** ✅
```
src/components/TarotAutoVideo.tsx
```
- **Funktion**: Der AUTO-CONTROLLER
- **Features**:
  - Lädt Tarot-Daten aus JSON
  - Lädt Audio + Whisper-Transkript
  - Generiert dynamische Keyframes
  - Rendert FlipTest mit TarotOverlay als Child

### 4. **style.css** ✅ (Erweitert)
```
src/style.css
```
- **Funktion**: Alle CSS-Styles aus deinen HTML-Vorlagen
- **Features**:
  - CSS Variables (--gold-main, --bg-dark, etc.)
  - Mystisches Design-System
  - Gradient-Borders
  - Crystal Ball Effects
  - Ornament Decorations

### 5. **FlipTest.tsx** ✅ (Angepasst)
```
src/components/FlipTest.tsx
```
- **Änderungen**:
  - Akzeptiert jetzt `children` Prop
  - Rendert TarotOverlay ODER fallback Template-Bild
  - Z-Index Management für Overlay

### 6. **Root.tsx** ✅ (Erweitert)
```
src/Root.tsx
```
- **Änderungen**:
  - Neue Composition: `AutoTarot-DerNarr`
  - Import von TarotAutoVideo

---

## 🚀 Wie benutze ich das System?

### **Schritt 1: Remotion Studio starten**
```bash
npm start
```

### **Schritt 2: Composition auswählen**
Im Remotion Studio siehst du jetzt:
- ✅ `AutoTarot-DerNarr` ← **DAS IST DAS NEUE!**
- `DerNarrVideo` (alte manuelle Version)
- `FlipTest` (Test-Playground)
- `TarotCard-0` bis `TarotCard-9` (einzelne Karten)

### **Schritt 3: Preview ansehen**
Klicke auf `AutoTarot-DerNarr` und drücke Play! 🎬

### **Schritt 4: Video rendern**
```bash
npx remotion render AutoTarot-DerNarr output.mp4
```

---

## 🎨 Wie funktioniert das Auto-Keyframing?

### **Flow-Diagramm:**
```
Whisper-JSON (DerNarr_transcript.json)
         ↓
autoKeyframing.ts scannt nach Keywords
         ↓
Generiert CameraKeyframes Array
         ↓
FlipTest.tsx interpoliert Zoom/Offset
         ↓
Kamera bewegt sich synchron zum Audio!
```

### **Keyword → Zoom Mapping:**
| **Keyword im Audio** | **Zoom-Ziel** | **Koordinaten** |
|---|---|---|
| "Narr", "Null" | Artwork Focus | zoom: 2.3, y: -26.5 |
| "bedeutet", "symbolisiert" | Narrative Center | zoom: 2.0, y: 5 |
| "Liebe", "romantisch" | Icons Love | zoom: 2.55, x: -23.5, y: 22 |
| "Karriere", "Beruf" | Icons Career | zoom: 2.55, x: 0, y: 22 |
| "spirituell", "Reise" | Icons Spirit | zoom: 2.55, x: 23.5, y: 22 |
| "Schatten", "Warnung" | Shadow Bottom | zoom: 2.5, y: 35 |

---

## 🔧 Anpassungen & Tweaks

### **Kamera-Positionen ändern:**
```typescript
// In src/utils/autoKeyframing.ts

const POSITIONS = {
    ARTWORK_FOCUS: { zoom: 2.3, x: 0, y: -26.5 }, // ← Hier anpassen!
    // ...
};
```

### **Keywords erweitern:**
```typescript
// In src/utils/autoKeyframing.ts

const KEYWORDS = {
    love: ['liebe', 'romantisch', 'herz'], // ← Hier Keywords hinzufügen!
    // ...
};
```

### **Design anpassen:**
```css
/* In src/style.css */

:root {
    --gold-main: #d4af37; /* ← Farben anpassen */
    --bg-dark: #1a1525;
}
```

---

## 📊 Nächste Schritte für vollständige Automatisierung

### **1. Alle 78 Karten automatisieren**
```typescript
// In Root.tsx - Loop durch alle Karten

tarotCards.forEach((card) => {
    return (
        <Composition
            id={`AutoTarot-${card.id}`}
            component={TarotAutoVideo}
            // Props mit card.id übergeben
        />
    );
});
```

### **2. Batch-Rendering Script**
```bash
# scripts/render-all.sh

for i in {0..77}; do
  npx remotion render "AutoTarot-$i" "output/tarot_$i.mp4"
done
```

### **3. Whisper-Integration für alle Audio-Files**
```typescript
// Auto-detect Audio + Transcript basierend auf Card-ID

const audioPath = staticFile(`audio/${cardData.nameEnglish}.mp3`);
const transcriptPath = `../data/${cardData.nameEnglish}_transcript.json`;
```

---

## 🐛 Debugging

### **Keyframes prüfen:**
```typescript
// In TarotAutoVideo.tsx - Kommentar entfernen:

React.useEffect(() => {
    debugKeyframeGeneration(narrTranscript);
}, []);
```

Das gibt dir in der Console:
```
🎬 AUTO-KEYFRAMING DEBUG
========================
⏱️  12.5s: "liebe"
   Matches: love
⏱️  18.3s: "karriere"
   Matches: career
========================
```

### **Overlay Position prüfen:**
- Öffne `AutoTarot-DerNarr`
- Drücke Pause bei Frame 120 (4 Sekunden)
- Prüfe ob die Karte korrekt im Arch-Fenster sitzt
- Falls nicht: Passe `cardTopPercent` in `TarotAutoVideo.tsx` an

---

## 🎉 Das war's!

Du hast jetzt ein **vollautomatisches Video-Produktionssystem** für alle 78 Tarot-Karten! 🚀

### **Was das System kann:**
✅ Auto-Keyframing basierend auf Audio-Transkript  
✅ Mystisches Design aus HTML-Templates  
✅ 3D Flip-Animation  
✅ Audio-synchronisierte Kamera-Bewegungen  
✅ Wiederverwendbar für alle 78 Karten  

### **Was noch fehlt:**
🔲 Audio + Transkripte für die restlichen 77 Karten  
🔲 Batch-Rendering Script  
🔲 Upload-Automation zu TikTok/Instagram  

---

## 📝 Lizenz & Credits

**LunarLoom** - Dein automatisches Tarot-Video-Studio 🌙✨
