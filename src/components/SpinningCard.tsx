import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, staticFile, Img } from 'remotion';
import { TarotCardVisual } from './TarotCardVisual';

interface SpinningCardProps {
    imageSrc: string;
    backImageSrc: string;
    durationInFrames: number;
}

export const SpinningCard: React.FC<SpinningCardProps> = ({ imageSrc, backImageSrc, durationInFrames }) => {
    const frame = useCurrentFrame();

    const resolve = (src: string) => {
        if (src.startsWith('http')) return src;
        const cleanSrc = src.startsWith('/') ? src.slice(1) : src;
        return staticFile(cleanSrc);
    }

    // Pure Y-Axis Spin (Coin Flip style)
    // Spin multiple times, slowing down to land on front
    const rotationY = interpolate(
        frame,
        [0, durationInFrames],
        [180 * 6, 0], // 6 spins, ending at 0 (Front)
        { extrapolateRight: 'clamp', easing: (t) => 1 - Math.pow(1 - t, 3) } // Cubic Ease Out
    );

    return (
        <AbsoluteFill style={{
            alignItems: 'center',
            justifyContent: 'center',
            perspective: '1500px' // Strong perspective for depth
        }}>
            <div style={{
                width: '400px', // Fixed size for the spinning element, should match TarotInfoCard layout size approx
                height: '700px',
                position: 'relative',
                transformStyle: 'preserve-3d',
                transform: `rotateY(${rotationY}deg)`
            }}>
                {/* Front Face */}
                <AbsoluteFill style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(0deg)'
                }}>
                    <TarotCardVisual imageSrc={imageSrc} />
                </AbsoluteFill>

                {/* Back Face */}
                <AbsoluteFill style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    backgroundColor: '#1a1025',
                    borderRadius: '150px 150px 10px 10px',
                    border: '6px solid #eacc85',
                    overflow: 'hidden'
                }}>
                    <Img src={resolve(backImageSrc)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </AbsoluteFill>
            </div>
        </AbsoluteFill>
    );
};
