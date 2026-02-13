import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, staticFile, Img, Easing } from 'remotion';
import { z } from 'zod';
import { presetNames } from '../data/flipPresets';

// === Keyframe Schema ===
const cameraKeyframeSchema = z.object({
    timeInSeconds: z.number().min(0).max(60).step(0.1),
    zoom: z.number().min(0.5).max(4).step(0.05).default(1),
    offsetX: z.number().min(-50).max(50).step(0.5).default(0),
    offsetY: z.number().min(-50).max(50).step(0.5).default(0),
});

// === Zod Schema for Studio Controls ===
export const flipTestSchema = z.object({
    // Preset Selector (top of controls)
    presetName: z.enum(['(custom)', ...presetNames]).default('(custom)'),

    // Video Duration
    durationInSeconds: z.number().min(1).max(30).step(0.5).default(5),

    // Card Position & Size
    cardWidth: z.number().min(100).max(800).default(420),
    cardHeight: z.number().min(200).max(1200).default(660),
    cardTopPercent: z.number().min(0).max(50).step(0.5).default(5.5),

    // 3D Perspective
    perspective: z.number().min(200).max(3000).step(50).default(1000),

    // Animation
    spinCount: z.number().min(1).max(12).default(6),
    spinDurationFrames: z.number().min(30).max(300).step(5).default(120),

    // Fade-In
    fadeInDuration: z.number().min(0).max(60).step(1).default(15),

    // Scale Pop
    scalePop: z.number().min(1).max(1.2).step(0.01).default(1.03),

    // Camera Keyframes (Markers)
    cameraKeyframes: z.array(cameraKeyframeSchema).default([
        { timeInSeconds: 0, zoom: 2, offsetX: 0, offsetY: -15 },
        { timeInSeconds: 3, zoom: 1, offsetX: 0, offsetY: 0 },
    ]),

    // Images
    frontImage: z.string().default('Der_Narr_Illustration.png'),
    backImage: z.string().default('cut_card_back.png'),
});

export type FlipTestProps = z.infer<typeof flipTestSchema>;

export const FlipTest: React.FC<FlipTestProps> = ({
    cardWidth,
    cardHeight,
    cardTopPercent,
    perspective,
    spinCount,
    spinDurationFrames,
    fadeInDuration,
    scalePop,
    cameraKeyframes,
    frontImage,
    backImage,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Sort keyframes by time and deduplicate (keep last value for duplicate times)
    const sorted = [...cameraKeyframes]
        .sort((a, b) => a.timeInSeconds - b.timeInSeconds)
        .reduce<typeof cameraKeyframes>((acc, kf) => {
            if (acc.length > 0 && acc[acc.length - 1].timeInSeconds === kf.timeInSeconds) {
                acc[acc.length - 1] = kf; // overwrite duplicate
            } else {
                acc.push(kf);
            }
            return acc;
        }, []);

    // Convert keyframes to frame-based arrays for interpolation
    const keyframeFrames = sorted.map(kf => Math.round(kf.timeInSeconds * fps));

    // Ensure strictly increasing
    for (let i = 1; i < keyframeFrames.length; i++) {
        if (keyframeFrames[i] <= keyframeFrames[i - 1]) {
            keyframeFrames[i] = keyframeFrames[i - 1] + 1;
        }
    }

    const keyframeZooms = sorted.map(kf => kf.zoom);
    const keyframeOffsetsX = sorted.map(kf => kf.offsetX);
    const keyframeOffsetsY = sorted.map(kf => kf.offsetY);

    // Interpolate camera values
    const canInterpolate = sorted.length >= 2;

    const cameraZoom = canInterpolate
        ? interpolate(frame, keyframeFrames, keyframeZooms, {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        })
        : sorted.length === 1 ? sorted[0].zoom : 1;

    const cameraOffsetX = canInterpolate
        ? interpolate(frame, keyframeFrames, keyframeOffsetsX, {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        })
        : sorted.length === 1 ? sorted[0].offsetX : 0;

    const cameraOffsetY = canInterpolate
        ? interpolate(frame, keyframeFrames, keyframeOffsetsY, {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        })
        : sorted.length === 1 ? sorted[0].offsetY : 0;

    // Card flip animation - Y-axis coin flip style
    const rotationY = interpolate(
        frame,
        [0, spinDurationFrames],
        [180 * spinCount, 0],
        { extrapolateRight: 'clamp', easing: (t) => 1 - Math.pow(1 - t, 3) }
    );

    // Subtle scale pop when card finishes flipping
    const popStart = spinDurationFrames - 5;
    const scaleFinish = interpolate(
        frame,
        [popStart, popStart + 10, popStart + 20],
        [1, scalePop, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.ease) }
    );

    // Fade in the whole scene
    const fadeIn = interpolate(frame, [0, fadeInDuration], [0, 1], { extrapolateRight: 'clamp' });

    return (
        <AbsoluteFill style={{ backgroundColor: '#0e0b16' }}>
            {/* Camera Zoom Wrapper — animated via keyframes */}
            <AbsoluteFill style={{
                transform: `scale(${cameraZoom}) translate(${-cameraOffsetX}%, ${-cameraOffsetY}%)`,
                transformOrigin: 'center center',
                opacity: fadeIn,
            }}>
                {/* Spinning Card */}
                <AbsoluteFill style={{
                    perspective: `${perspective}px`,
                }}>
                    <div style={{
                        width: `${cardWidth}px`,
                        height: `${cardHeight}px`,
                        position: 'absolute',
                        top: `${cardTopPercent}%`,
                        left: '50%',
                        transformStyle: 'preserve-3d',
                        transform: `translateX(-50%) scale(${scaleFinish}) rotateY(${rotationY}deg)`,
                        transformOrigin: 'center center',
                    }}>
                        {/* Front Face */}
                        <AbsoluteFill style={{
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(0deg)',
                            overflow: 'hidden',
                        }}>
                            <Img
                                src={staticFile(frontImage)}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                        </AbsoluteFill>

                        {/* Back Face */}
                        <AbsoluteFill style={{
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                            overflow: 'hidden',
                        }}>
                            <Img
                                src={staticFile(backImage)}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                        </AbsoluteFill>
                    </div>
                </AbsoluteFill>

                {/* Template overlay */}
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
