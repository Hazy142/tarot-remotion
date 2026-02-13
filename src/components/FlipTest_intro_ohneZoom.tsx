import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, staticFile, Img, Easing } from 'remotion';

export const FlipTest: React.FC = () => {
    const frame = useCurrentFrame();

    // Card flip animation - Y-axis coin flip style
    // 6 full spins, decelerating to land on front (0°)
    const rotationY = interpolate(
        frame,
        [0, 120],
        [180 * 6, 0],
        { extrapolateRight: 'clamp', easing: (t) => 1 - Math.pow(1 - t, 3) }
    );

    // Subtle scale pop when card finishes flipping
    const scaleFinish = interpolate(
        frame,
        [115, 125, 135],
        [1, 1.03, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.ease) }
    );

    // Fade in the whole scene
    const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

    return (
        <AbsoluteFill style={{ backgroundColor: '#0e0b16' }}>
            {/* Background Template (has transparent area for card) */}
            <AbsoluteFill style={{ opacity: fadeIn }}>
                {/* Spinning Card - positioned to fill the transparent card area */}
                <AbsoluteFill style={{
                    perspective: '1000px',
                }}>
                    <div style={{
                        width: '420px',
                        height: '660px',
                        position: 'absolute',
                        top: '5.5%',
                        left: '50%',
                        transformStyle: 'preserve-3d',
                        transform: `translateX(-50%) scale(${scaleFinish}) rotateY(${rotationY}deg)`,
                        transformOrigin: 'center center',
                    }}>
                        {/* Front Face - Der Narr Illustration */}
                        <AbsoluteFill style={{
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(0deg)',
                            overflow: 'hidden',
                        }}>
                            <Img
                                src={staticFile('Der_Narr_Illustration.png')}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                        </AbsoluteFill>

                        {/* Back Face - Card Back */}
                        <AbsoluteFill style={{
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                            overflow: 'hidden',
                        }}>
                            <Img
                                src={staticFile('cut_card_back.png')}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                        </AbsoluteFill>
                    </div>
                </AbsoluteFill>

                {/* Template overlay ON TOP of the card (so transparent area reveals the card) */}
                <AbsoluteFill style={{ pointerEvents: 'none' }}>
                    <Img
                        src={staticFile('template_overview_transparent.png')}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                        }}
                    />
                </AbsoluteFill>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
