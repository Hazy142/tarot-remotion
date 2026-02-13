/**
 * autoKeyframing.ts
 * =================
 * 
 * Das GEHIRN des Auto-Video-Systems.
 * 
 * Diese Datei scannt Whisper-Transkripte nach Keywords und generiert 
 * automatisch Kamera-Keyframes für die perfekte Synchronisation 
 * zwischen Audio und visuellen Zooms.
 * 
 * Flow:
 * 1. Whisper-JSON rein (Wort-für-Wort Timestamps)
 * 2. Keyword-Matching (Liebe, Karriere, Schatten, etc.)
 * 3. Kamera-Keyframes raus (Zoom, OffsetX, OffsetY)
 */

// ===================================
// TYPE DEFINITIONS
// ===================================

export type WhisperFragment = {
    text: string;
    startMs: number;
    endMs: number;
    timestampMs?: number;
    confidence?: number;
};

export type CameraKeyframe = {
    timeInSeconds: number;
    zoom: number;
    offsetX: number;
    offsetY: number;
};

// ===================================
// CAMERA POSITIONS
// ===================================
// Diese Koordinaten sind abgestimmt auf das TarotOverlay.tsx Layout

const POSITIONS = {
    // Volle Sicht (Intro/Outro)
    FULL_VIEW: { zoom: 1, x: 0, y: 0 },
    
    // Fokus auf die Karte im Arch-Fenster (oben) - 0-45% des Screens
    ARTWORK_FOCUS: { zoom: 2.3, x: 0, y: -30 },
    
    // Fokus auf 2-Spalten Layout (Mitte) - 46-70%
    CONTENT_CENTER: { zoom: 1.8, x: 0, y: 8 },
    
    // Fokus auf linke Spalte (Kernbedeutung)
    LEFT_COLUMN: { zoom: 2.2, x: -18, y: 8 },
    
    // Fokus auf rechte Spalte (Kosmos)
    RIGHT_COLUMN: { zoom: 2.2, x: 18, y: 8 },
    
    // Fokus auf "Deutung im Alltag" Section - 70-85%
    MEANINGS_SECTION: { zoom: 2.3, x: 0, y: 26 },
    
    // Fokus auf einzelne Icons
    ICONS_LOVE: { zoom: 2.8, x: -24, y: 26 },
    ICONS_CAREER: { zoom: 2.8, x: 0, y: 26 },
    ICONS_SPIRIT: { zoom: 2.8, x: 24, y: 26 },
    
    // Fokus auf Kristallkugeln (ganz unten) - 85-100%
    SHADOW_BOTTOM: { zoom: 2.6, x: 0, y: 40 },
} as const;

// ===================================
// KEYWORD MAPPINGS
// ===================================

const KEYWORDS = {
    // Intro/Identität
    intro: ['narr', 'nummer', 'null', 'karte'],
    
    // Kernbedeutung & Symbolik
    meaning: ['bedeutet', 'symbolisiert', 'steht für', 'repräsentiert', 'verkörpert'],
    
    // Liebe
    love: ['liebe', 'romantisch', 'beziehung', 'herz', 'partner'],
    
    // Karriere
    career: ['karriere', 'beruf', 'job', 'arbeit', 'erfolg', 'projekt'],
    
    // Spirituell
    spirit: ['spirituell', 'reise', 'universum', 'intuition', 'meditation'],
    
    // Schattenseite
    shadow: ['umgekehrt', 'warnung', 'schatten', 'naivität', 'leichtsinn', 'vorsicht'],
} as const;

// ===================================
// MAIN GENERATOR FUNCTION
// ===================================

export function generateKeyframesFromTranscript(
    fragments: WhisperFragment[]
): CameraKeyframe[] {
    const keyframes: CameraKeyframe[] = [];
    
    // Helper: Convert milliseconds to seconds
    const msToSec = (ms: number) => ms / 1000;
    
    // Tracking flags to ensure each section is only focused once
    let hasShownMeaning = false;
    let hasShownLove = false;
    let hasShownCareer = false;
    let hasShownSpirit = false;
    let hasShownShadow = false;
    
    // START: Immer mit Fokus auf Artwork beginnen (während Flip-Animation)
    keyframes.push({
        timeInSeconds: 0,
        zoom: POSITIONS.ARTWORK_FOCUS.zoom,
        offsetX: POSITIONS.ARTWORK_FOCUS.x,
        offsetY: POSITIONS.ARTWORK_FOCUS.y,
    });
    
    // Nach 4 Sekunden: Rauszoomen zur Full View
    keyframes.push({
        timeInSeconds: 4.5,
        zoom: POSITIONS.FULL_VIEW.zoom,
        offsetX: POSITIONS.FULL_VIEW.x,
        offsetY: POSITIONS.FULL_VIEW.y,
    });
    
    // SCAN: Durch alle Fragmente durchgehen
    for (const fragment of fragments) {
        const text = fragment.text.trim().toLowerCase();
        const time = msToSec(fragment.startMs);
        
        // Skip zu frühe Timestamps (während Intro)
        if (time < 5) continue;
        
        // 1. KERNBEDEUTUNG / SYMBOLIK (Linke Spalte)
        if (!hasShownMeaning && matchesKeywords(text, KEYWORDS.meaning)) {
            keyframes.push({
                timeInSeconds: time,
                zoom: POSITIONS.LEFT_COLUMN.zoom,
                offsetX: POSITIONS.LEFT_COLUMN.x,
                offsetY: POSITIONS.LEFT_COLUMN.y,
            });
            hasShownMeaning = true;
            continue;
        }
        
        // 2. LIEBE
        if (!hasShownLove && matchesKeywords(text, KEYWORDS.love)) {
            keyframes.push({
                timeInSeconds: time,
                zoom: POSITIONS.ICONS_LOVE.zoom,
                offsetX: POSITIONS.ICONS_LOVE.x,
                offsetY: POSITIONS.ICONS_LOVE.y,
            });
            hasShownLove = true;
            continue;
        }
        
        // 3. KARRIERE
        if (!hasShownCareer && matchesKeywords(text, KEYWORDS.career)) {
            keyframes.push({
                timeInSeconds: time,
                zoom: POSITIONS.ICONS_CAREER.zoom,
                offsetX: POSITIONS.ICONS_CAREER.x,
                offsetY: POSITIONS.ICONS_CAREER.y,
            });
            hasShownCareer = true;
            continue;
        }
        
        // 4. SPIRITUELL
        if (!hasShownSpirit && matchesKeywords(text, KEYWORDS.spirit)) {
            keyframes.push({
                timeInSeconds: time,
                zoom: POSITIONS.ICONS_SPIRIT.zoom,
                offsetX: POSITIONS.ICONS_SPIRIT.x,
                offsetY: POSITIONS.ICONS_SPIRIT.y,
            });
            hasShownSpirit = true;
            continue;
        }
        
        // 5. SCHATTENSEITE
        if (!hasShownShadow && matchesKeywords(text, KEYWORDS.shadow)) {
            keyframes.push({
                timeInSeconds: time,
                zoom: POSITIONS.SHADOW_BOTTOM.zoom,
                offsetX: POSITIONS.SHADOW_BOTTOM.x,
                offsetY: POSITIONS.SHADOW_BOTTOM.y,
            });
            hasShownShadow = true;
            continue;
        }
    }
    
    // END: Zurück zur Full View für Outro
    const lastFragment = fragments[fragments.length - 1];
    if (lastFragment) {
        const outroTime = msToSec(lastFragment.endMs) + 1.5;
        keyframes.push({
            timeInSeconds: outroTime,
            zoom: POSITIONS.FULL_VIEW.zoom,
            offsetX: POSITIONS.FULL_VIEW.x,
            offsetY: POSITIONS.FULL_VIEW.y,
        });
    }
    
    // Sortieren nach Zeit (sollte schon sortiert sein, aber sicher ist sicher)
    return keyframes.sort((a, b) => a.timeInSeconds - b.timeInSeconds);
}

// ===================================
// HELPER FUNCTIONS
// ===================================

/**
 * Prüft ob der Text eines der Keywords enthält
 */
function matchesKeywords(text: string, keywords: readonly string[]): boolean {
    return keywords.some(keyword => text.includes(keyword));
}

/**
 * OPTIONAL: Erweiterte Funktion für Debugging
 * Zeigt an, welche Keywords gefunden wurden
 */
export function debugKeyframeGeneration(fragments: WhisperFragment[]): void {
    console.log('🎬 AUTO-KEYFRAMING DEBUG');
    console.log('========================');
    
    for (const fragment of fragments) {
        const text = fragment.text.trim().toLowerCase();
        const time = (fragment.startMs / 1000).toFixed(2);
        
        const matches = {
            meaning: matchesKeywords(text, KEYWORDS.meaning),
            love: matchesKeywords(text, KEYWORDS.love),
            career: matchesKeywords(text, KEYWORDS.career),
            spirit: matchesKeywords(text, KEYWORDS.spirit),
            shadow: matchesKeywords(text, KEYWORDS.shadow),
        };
        
        const hasMatch = Object.values(matches).some(v => v);
        
        if (hasMatch) {
            console.log(`⏱️  ${time}s: "${fragment.text}"`);
            console.log(`   Matches:`, Object.entries(matches).filter(([, v]) => v).map(([k]) => k).join(', '));
        }
    }
    
    console.log('========================');
}
