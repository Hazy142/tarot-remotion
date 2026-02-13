import React from 'react';
import { AbsoluteFill, Audio, interpolate, useCurrentFrame, useVideoConfig, staticFile, Easing } from 'remotion';
import { CameraMotionBlur } from '@remotion/motion-blur';
import { TarotInfoCard } from './TarotInfoCard';
import { SpinningCard } from './SpinningCard';
import { derNarrData } from '../data/der_narr_data';

export const DerNarrVideo: React.FC = () => {
    const frame = useCurrentFrame();

    // Config
    const introDuration = 150; // 5s spin
    const isIntro = frame < introDuration + 30; // Keep overlay a bit longer for transition

    // Layout Focus Points (Active layout of TarotInfoCard)
    // Coords relative to center (0,0) in %
    // Top Card Center: ~ Y: -25%
    // Meaning (Left Mid): X: -20%, Y: 5%
    // Cosmos (Right Mid): X: 20%, Y: 5%
    // Daily (Bottom Mid): Y: 25%
    // Shadow (Bottom): Y: 40%

    const focusPoints = {
        card: { x: 0, y: -25, scale: 2.2 },
        full: { x: 0, y: 0, scale: 1 },
        meaning: { x: -20, y: 5, scale: 2 },
        cosmos: { x: 20, y: 5, scale: 2 },
        daily: { x: 0, y: 25, scale: 2 },
        shadow: { x: 0, y: 40, scale: 2 }
    };

    // Timing
    // 0-5s: Intro Spin (Focus on Card)
    // 5s-6s: Zoom Out to Full
    // 12s: Zoom Meaning
    // 34s: Zoom Cosmos
    // 43s: Zoom Daily
    // 58s: Zoom Shadow
    // 68s: Outro

    const cameraX = interpolate(
        frame,
        [0, 150, 180, 360, 420, 1000, 1060, 1260, 1320, 1710, 1770, 2010, 2070],
        [
            focusPoints.card.x, focusPoints.card.x, // Intro
            focusPoints.full.x, focusPoints.full.x, // Reveal Full
            focusPoints.meaning.x, focusPoints.meaning.x, // Meaning
            focusPoints.cosmos.x, focusPoints.cosmos.x, // Cosmos
            focusPoints.daily.x, focusPoints.daily.x, // Daily
            focusPoints.shadow.x, focusPoints.shadow.x, // Shadow
            focusPoints.full.x // Outro
        ],
        { extrapolateRight: 'clamp', easing: Easing.inOut(Easing.ease) }
    );

    const cameraY = interpolate(
        frame,
        [0, 150, 180, 360, 420, 1000, 1060, 1260, 1320, 1710, 1770, 2010, 2070],
        [
            focusPoints.card.y, focusPoints.card.y,
            focusPoints.full.y, focusPoints.full.y,
            focusPoints.meaning.y, focusPoints.meaning.y,
            focusPoints.cosmos.y, focusPoints.cosmos.y,
            focusPoints.daily.y, focusPoints.daily.y,
            focusPoints.shadow.y, focusPoints.shadow.y,
            focusPoints.full.y
        ],
        { extrapolateRight: 'clamp', easing: Easing.inOut(Easing.ease) }
    );

    const cameraScale = interpolate(
        frame,
        [0, 150, 180, 360, 420, 1000, 1060, 1260, 1320, 1710, 1770, 2010, 2070],
        [
            focusPoints.card.scale, focusPoints.card.scale,
            focusPoints.full.scale, focusPoints.full.scale,
            focusPoints.meaning.scale, focusPoints.meaning.scale,
            focusPoints.cosmos.scale, focusPoints.cosmos.scale,
            focusPoints.daily.scale, focusPoints.daily.scale,
            focusPoints.shadow.scale, focusPoints.shadow.scale,
            focusPoints.full.scale
        ],
        { extrapolateRight: 'clamp', easing: Easing.inOut(Easing.ease) }
    );

    return (
        <AbsoluteFill style={{ backgroundColor: '#0e0b16' }}>
            <Audio src={staticFile("DerNarr_audio.mp3.mp3")} />

            <CameraMotionBlur shutterAngle={180} samples={8}>
                <AbsoluteFill style={{
                    transform: `scale(${cameraScale}) translate(${-cameraX}%, ${-cameraY}%)`,
                    transformOrigin: 'center center'
                }}>

                    {/* Layer 1: The Full Info Card (Always visible, but card visual might be hidden during intro if we want) */}
                    {/* We let it render fully. The Overlay will cover the card part. */}
                    <TarotInfoCard {...derNarrData} showCardVisual={true} />

                    {/* Layer 2: Intro Spinning Card Overlay */}
                    {/* Positioned ABSOLUTELY to match the card slot in TarotInfoCard */}
                    {/* Based on TarotInfoCard grid: Row 1 is 38%. Card is centered. */}
                    {isIntro && (
                        <div style={{
                            position: 'absolute',
                            top: '40px', // Matches padding-top of TarotInfoCard
                            left: '0',
                            right: '0',
                            height: '38%', // Matches Row 1 height approx? No, Grid row 1 is 38% of total height.
                            // Need to be careful with positioning.
                            // Best way: Centered horizontally, Top 40px + some offset
                            display: 'flex',
                            justifyContent: 'center',
                            zIndex: 10
                        }}>
                            {/* Wrapper to match the size in TarotInfoCard (380px width) */}
                            <div style={{ width: '380px', height: '100%' }}>
                                <SpinningCard
                                    imageSrc={derNarrData.imageSrc}
                                    backImageSrc={derNarrData.backImageSrc}
                                    durationInFrames={introDuration}
                                />
                            </div>
                        </div>
                    )}

                </AbsoluteFill>
            </CameraMotionBlur>
        </AbsoluteFill>
    );
};
