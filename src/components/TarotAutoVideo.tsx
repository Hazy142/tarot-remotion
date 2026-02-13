/**
 * TarotAutoVideo.tsx
 * ===================
 * 
 * Der AUTO-CONTROLLER.
 * 
 * Diese Komponente verbindet:
 * - Tarot-Daten (tarot-cards.json)
 * - Audio (DerNarr_audio.mp3)
 * - Whisper-Transkript (DerNarr_transcript.json)
 * - Auto-Keyframing (autoKeyframing.ts)
 * 
 * Und rendert ein vollautomatisches Video mit:
 * - 3D Flip-Animation
 * - Audio-synchronisierte Kamera-Bewegungen
 * - Mystisches Overlay-Design
 * 
 * ALLE Parameter sind als Studio-Controls verfügbar!
 */

import React from 'react';
import { AbsoluteFill, Audio, staticFile } from 'remotion';
import { z } from 'zod';
import { FlipTest } from './FlipTest';
import { TarotOverlay } from './TarotOverlay';
import { generateKeyframesFromTranscript } from '../utils/autoKeyframing';

// Data Imports
import tarotCards from '../data/tarot-cards.json';
import narrTranscript from '../data/DerNarr_transcript.json';

// ===================================================================
// ZOD SCHEMA — Creates visual controls in Remotion Studio sidebar
// ===================================================================
export const tarotAutoVideoSchema = z.object({
    // ─── CARD SETTINGS ───────────────────────────────────────
    cardWidth: z.number().min(200).max(800).step(10).default(440)
        .describe('Kartenbreite in Pixeln'),
    cardHeight: z.number().min(300).max(1200).step(10).default(690)
        .describe('Kartenhöhe in Pixeln'),
    cardTopPercent: z.number().min(0).max(30).step(0.5).default(5.5)
        .describe('Karte Y-Position (% von oben)'),

    // ─── 3D & ANIMATION ──────────────────────────────────────
    perspective: z.number().min(200).max(3000).step(50).default(1000)
        .describe('3D-Perspektive (kleiner = dramatischer)'),
    spinCount: z.number().min(1).max(12).default(1)
        .describe('Anzahl Umdrehungen'),
    spinDurationFrames: z.number().min(30).max(300).step(5).default(120)
        .describe('Flip-Dauer in Frames (30fps)'),
    fadeInDuration: z.number().min(0).max(60).step(1).default(15)
        .describe('Einblendung in Frames'),
    scalePop: z.number().min(1).max(1.2).step(0.01).default(1.03)
        .describe('Pop-Effekt beim Flip-Ende'),

    // ─── CAMERA KEYFRAMES (Timestamp Markers!) ───────────────
    useAutoKeyframes: z.boolean().default(true)
        .describe('Auto-Keyframes aus Transkript? (false = manuelle Marker)'),
    cameraKeyframes: z.array(z.object({
        timeInSeconds: z.number().min(0).max(120).step(0.1),
        zoom: z.number().min(0.5).max(4).step(0.05).default(1),
        offsetX: z.number().min(-50).max(50).step(0.5).default(0),
        offsetY: z.number().min(-50).max(50).step(0.5).default(0),
    })).default([
        { timeInSeconds: 0, zoom: 2.3, offsetX: 0, offsetY: -26.5 },
        { timeInSeconds: 4.5, zoom: 2.3, offsetX: 0, offsetY: -26.5 },
        { timeInSeconds: 5.5, zoom: 1, offsetX: 0, offsetY: 0 },
        { timeInSeconds: 6.5, zoom: 2.55, offsetX: -23.5, offsetY: 4 },
        { timeInSeconds: 8.5, zoom: 2.55, offsetX: -23.5, offsetY: 4 },
        { timeInSeconds: 10, zoom: 1, offsetX: 0, offsetY: 0 },
    ]),

    // ─── OVERLAY LAYOUT (% Positionen) ───────────────────────
    frameHeightPercent: z.number().min(30).max(55).step(0.5).default(42)
        .describe('Rahmenhöhe (% des Screens)'),
    contentTopPercent: z.number().min(35).max(65).step(0.5).default(50)
        .describe('Content-Start (% von oben)'),
    bottomSectionTopPercent: z.number().min(60).max(85).step(0.5).default(75)
        .describe('Deutung-Sektion (% von oben)'),
    shadowSectionTopPercent: z.number().min(75).max(95).step(0.5).default(89)
        .describe('Schatten-Sektion (% von oben)'),

    // ─── FONT SIZES ─────────────────────────────────────────
    titleFontSize: z.number().min(16).max(40).step(1).default(26)
        .describe('Titel-Schriftgröße (px)'),
    bodyFontSize: z.number().min(12).max(28).step(1).default(17)
        .describe('Text-Schriftgröße (px)'),
    headingFontSize: z.number().min(14).max(32).step(1).default(20)
        .describe('Überschrift-Schriftgröße (px)'),

    // ─── ICON SIZES ──────────────────────────────────────────
    cosmicIconSize: z.number().min(60).max(200).step(5).default(110)
        .describe('Wind/Planet Icon-Größe (px)'),
    meaningIconSize: z.number().min(80).max(250).step(5).default(160)
        .describe('Liebe/Karriere/Spirit Icon-Größe (px)'),
    crystalBallSize: z.number().min(80).max(250).step(5).default(150)
        .describe('Kristallkugel-Größe (px)'),

    // ─── CONTENT PADDING ─────────────────────────────────────
    contentPaddingX: z.number().min(10).max(100).step(5).default(50)
        .describe('Seitlicher Abstand Content (px)'),
    columnGap: z.number().min(10).max(80).step(5).default(40)
        .describe('Spaltenabstand (px)'),

    // ─── NUMBER BADGE ────────────────────────────────────────
    badgeSize: z.number().min(30).max(100).step(5).default(60)
        .describe('Nummern-Badge Größe (px)'),
    badgeTopOffset: z.number().min(0).max(100).step(5).default(20)
        .describe('Badge Y-Offset (px)'),

    // ─── IMAGES ──────────────────────────────────────────────
    frontImage: z.string().default('Der_Narr_Illustration.png'),
    backImage: z.string().default('cut_card_back.png'),
});

export type TarotAutoVideoProps = z.infer<typeof tarotAutoVideoSchema>;

export const TarotAutoVideo: React.FC<TarotAutoVideoProps> = (props) => {
    const {
        // Card & Animation
        cardWidth, cardHeight, cardTopPercent,
        perspective, spinCount, spinDurationFrames,
        fadeInDuration, scalePop,
        frontImage, backImage,
        // Overlay Layout
        frameHeightPercent, contentTopPercent,
        bottomSectionTopPercent, shadowSectionTopPercent,
        titleFontSize, bodyFontSize, headingFontSize,
        cosmicIconSize, meaningIconSize, crystalBallSize,
        contentPaddingX, columnGap,
        badgeSize, badgeTopOffset,
    } = props;

    // 1. DATEN LADEN
    const cardId = "0";
    const cardData = tarotCards.find(c => c.id === cardId);

    if (!cardData) {
        return (
            <AbsoluteFill style={{
                backgroundColor: '#1a1525',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#d4af37',
                fontSize: '24px',
                fontFamily: 'serif'
            }}>
                ⚠️ Karte nicht gefunden: ID {cardId}
            </AbsoluteFill>
        );
    }

    // 2. KEYFRAMES — Auto (Transkript) oder Manuell (Studio Marker)
    const autoKeyframes = generateKeyframesFromTranscript(narrTranscript);
    const activeKeyframes = props.useAutoKeyframes ? autoKeyframes : props.cameraKeyframes;

    // 3. VIDEO-DAUER BERECHNEN
    const lastFragment = narrTranscript[narrTranscript.length - 1];
    const durationInSeconds = (lastFragment.endMs / 1000) + 3;

    // 4. SHADOW KEYWORDS
    const shadowKeywords = cardData.meaningReversed
        .split(',')
        .map(w => w.trim())
        .filter(w => w.length > 0)
        .slice(0, 3);

    // 5. RENDER
    return (
        <AbsoluteFill style={{ backgroundColor: '#1a1525' }}>
            {/* AUDIO */}
            <Audio src={staticFile('DerNarr_audio.mp3.mp3')} />

            {/* 3D FLIP + KAMERA-SYSTEM */}
            <FlipTest
                durationInSeconds={durationInSeconds}
                frontImage={frontImage}
                backImage={backImage}
                cardWidth={cardWidth}
                cardHeight={cardHeight}
                cardTopPercent={cardTopPercent}
                perspective={perspective}
                spinCount={spinCount}
                spinDurationFrames={spinDurationFrames}
                fadeInDuration={fadeInDuration}
                scalePop={scalePop}
                cameraKeyframes={activeKeyframes}
                presetName="(custom)"
            >
                {/* OVERLAY — alle Layout-Werte kommen direkt als Props */}
                <TarotOverlay
                    cardName={cardData.name}
                    number={cardData.number}
                    keywords={cardData.keywords}
                    meaningUpright={cardData.meaningUpright}
                    meaningLove={cardData.meaningLove}
                    meaningCareer={cardData.meaningCareer}
                    meaningSpirit={cardData.meaningSpirituality}
                    shadowKeywords={shadowKeywords}
                    element={cardData.element}
                    planet={cardData.planetSign}
                    frameHeightPercent={frameHeightPercent}
                    contentTopPercent={contentTopPercent}
                    bottomSectionTopPercent={bottomSectionTopPercent}
                    shadowSectionTopPercent={shadowSectionTopPercent}
                    titleFontSize={titleFontSize}
                    bodyFontSize={bodyFontSize}
                    headingFontSize={headingFontSize}
                    cosmicIconSize={cosmicIconSize}
                    meaningIconSize={meaningIconSize}
                    crystalBallSize={crystalBallSize}
                    contentPaddingX={contentPaddingX}
                    columnGap={columnGap}
                    badgeSize={badgeSize}
                    badgeTopOffset={badgeTopOffset}
                />
            </FlipTest>
        </AbsoluteFill>
    );
};
