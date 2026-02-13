import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CardBack } from './CardBack';

interface TarotCardProps {
    title: string;
    number: string;
    imageSrc?: string;
    element?: string;
}

export const TarotCard: React.FC<TarotCardProps> = ({ title, number, imageSrc, element }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // ---------------------------------------------------------
    // 1. ANIMATIONS
    // ---------------------------------------------------------

    // Flip Animation (0 -> 180 degrees)
    // Starts at frame 15, takes about 40 frames
    const flipSpring = spring({
        frame: frame - 10,
        fps,
        config: { mass: 2, damping: 20, stiffness: 80 }, // Heavier feel for a card
    });

    const rotation = interpolate(flipSpring, [0, 1], [180, 0]); // Start at 180 (Back), end at 0 (Front)

    // Entrance: Scale slightly during flip
    const scale = interpolate(flipSpring, [0, 0.5, 1], [0.8, 1.1, 1]);

    // Shimmer for borders (Continuous)
    const shimmerPos = (frame / 2) % 200;

    // Text Reveal (Starts after flip completes)
    const textReveal = spring({
        frame: frame - 45, // Delay until flip is mostly done
        fps,
        config: { damping: 15 },
    });
    const textOpacity = interpolate(textReveal, [0, 1], [0, 1]);
    const textTranslateY = interpolate(textReveal, [0, 1], [10, 0]);


    // ---------------------------------------------------------
    // 2. STYLES (Inline for Robustness)
    // ---------------------------------------------------------

    // 3D Scene Container
    const sceneStyle: React.CSSProperties = {
        perspective: '2000px', // Distance from the viewer
        width: '800px',
        height: '1400px',
        position: 'relative',
    };

    // The flippable object
    const cardContainerStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        position: 'relative',
        transformStyle: 'preserve-3d', // Crucial for 3D
        transform: `rotateY(${rotation}deg) scale(${scale})`, // Apply rotation and scale
        transformOrigin: 'center center',
    };

    // Common style for Front and Back faces
    const faceStyle: React.CSSProperties = {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backfaceVisibility: 'hidden', // Hides the back when facing away
        top: 0,
        left: 0,
        borderRadius: '80px', // Match the card radius
        overflow: 'hidden', // Clip content to radius
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)', // Drop shadow
    };

    // Front Face Style (The Tarot Card content)
    const frontFaceStyle: React.CSSProperties = {
        ...faceStyle,
        transform: 'rotateY(0deg)', // Front faces forward
        border: '6px solid #c5a059',
        backgroundColor: '#1a0b2e',
        // Make sure border radius is respected for children
    };

    // Back Face Style
    const backFaceStyle: React.CSSProperties = {
        ...faceStyle,
        transform: 'rotateY(180deg)', // Back faces backward
    };


    return (
        <AbsoluteFill className="bg-neutral-950 flex items-center justify-center font-serif text-white">

            {/* Perspective Container */}
            <div style={sceneStyle}>

                {/* Rotating Card Container */}
                <div style={cardContainerStyle}>

                    {/* --- FRONT FACE (The Tarot Card) --- */}
                    <div style={frontFaceStyle}>
                        {/* 1. Background (Art Deco SVG) */}
                        <div style={{ position: 'absolute', inset: 0, opacity: 0.8, pointerEvents: 'none', zIndex: 0 }}>
                            <svg width="100%" height="100%" viewBox="0 0 400 700" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#f3e5ab" />
                                        <stop offset="50%" stopColor="#d4af37" />
                                        <stop offset="100%" stopColor="#9b7a28" />
                                    </linearGradient>
                                    <linearGradient id="shimmer-grad" x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform={`translate(${shimmerPos - 100} 0)`}>
                                        <stop offset="0%" stopColor="transparent" />
                                        <stop offset="50%" stopColor="white" />
                                        <stop offset="100%" stopColor="transparent" />
                                    </linearGradient>
                                </defs>

                                {/* Lines */}
                                <g stroke="url(#gold-grad)" strokeWidth="1.5" fill="none" strokeLinecap="round">
                                    <path d="M 20 150 Q 50 50 150 20" />
                                    <path d="M 20 200 Q 60 60 200 20" />
                                    <path d="M 20 250 Q 80 80 140 20" />
                                    <path d="M 0 100 L 50 50" />
                                    <path d="M 380 150 Q 350 50 250 20" />
                                    <path d="M 380 200 Q 340 60 200 20" />
                                    <path d="M 380 250 Q 320 80 260 20" />
                                    <path d="M 400 100 L 350 50" />
                                    <path d="M 20 250 C 60 350 60 450 20 550" />
                                    <path d="M 380 250 C 340 350 340 450 380 550" />
                                    <path d="M 20 550 Q 50 650 150 680" />
                                    <path d="M 20 500 Q 60 640 200 680" />
                                    <path d="M 0 600 L 50 650" />
                                    <path d="M 380 550 Q 350 650 250 680" />
                                    <path d="M 380 500 Q 340 640 200 680" />
                                    <path d="M 400 600 L 350 650" />
                                </g>

                                {/* Shimmer Overlay */}
                                <rect x="0" y="0" width="400" height="700" fill="url(#shimmer-grad)" opacity="0.1" style={{ mixBlendMode: 'overlay' }} />
                            </svg>
                        </div>

                        {/* 2. Top Badge (Number) */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: '50%',
                            transform: `translate(-50%, ${textTranslateY}px)`,
                            width: '240px',
                            height: '120px',
                            zIndex: 20,
                            opacity: textOpacity
                        }}>
                            <svg viewBox="0 0 120 60" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}>
                                <defs>
                                    <linearGradient id="badge-grad-2" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#e3d2b6" />
                                        <stop offset="50%" stopColor="#d4af37" />
                                        <stop offset="100%" stopColor="#9b7a28" />
                                    </linearGradient>
                                </defs>
                                <path d="M 0 0 L 120 0 L 110 30 Q 60 60 10 30 Z" fill="url(#badge-grad-2)" stroke="#fceabb" strokeWidth="2" />
                            </svg>
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: '16px' }}>
                                <span style={{ fontSize: '3rem', fontWeight: 'bold', color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)', fontFamily: 'serif' }}>
                                    {number}
                                </span>
                            </div>
                        </div>

                        {/* 3. Central Image Window */}
                        <div style={{
                            position: 'absolute',
                            top: '14%',
                            left: '50%',
                            width: '72%',
                            height: '62%',
                            transform: 'translateX(-50%)',
                            zIndex: 10
                        }}>
                            {/* The Frame */}
                            <div style={{
                                width: '100%',
                                height: '100%',
                                borderTopLeftRadius: '50% 20%', // Custom rounded arch
                                borderTopRightRadius: '50% 20%',
                                border: '6px solid #d4af37',
                                padding: '8px',
                                background: 'linear-gradient(to bottom, #d4af37, #9b7a28)',
                                boxShadow: '0 0 30px rgba(212,175,55,0.4)'
                            }}>
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    background: '#1a0b2e',
                                    padding: '4px',
                                    borderTopLeftRadius: '48% 19%',
                                    borderTopRightRadius: '48% 19%',
                                    overflow: 'hidden',
                                    position: 'relative'
                                }}>
                                    {imageSrc ? (
                                        <Img src={imageSrc} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        // Fallback
                                        <div style={{ width: '100%', height: '100%', backgroundColor: '#0a0510', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, #2a1b3d 0%, #1a0b2e 60%, #0a0510 100%)' }}></div>
                                            <div style={{
                                                width: '200px', height: '200px', borderRadius: '50%', border: '2px solid #d4af37',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.3
                                            }}>
                                                <div style={{ width: '140px', height: '140px', border: '1px solid #fceabb', transform: `rotate(${frame * 2}deg)` }}></div>
                                            </div>
                                            <span style={{ position: 'absolute', color: '#d4af37', fontSize: '1.5rem', opacity: 0.5, letterSpacing: '0.2em' }}>NO IMAGE</span>
                                        </div>
                                    )}

                                    {/* Inner Glow Overlay */}
                                    <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 80px rgba(26,11,46,0.8)', pointerEvents: 'none' }}></div>
                                </div>
                            </div>
                        </div>

                        {/* 4. Bottom Title Banner */}
                        <div style={{
                            position: 'absolute',
                            bottom: '6%',
                            left: '50%',
                            transform: `translate(-50%, ${textTranslateY}px)`,
                            width: '90%',
                            height: '14%',
                            zIndex: 20,
                            opacity: textOpacity,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <svg viewBox="0 0 300 80" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.5))' }}>
                                <defs>
                                    <linearGradient id="banner-grad-2" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#f3e5ab" />
                                        <stop offset="20%" stopColor="#d4af37" />
                                        <stop offset="80%" stopColor="#d4af37" />
                                        <stop offset="100%" stopColor="#9b7a28" />
                                    </linearGradient>
                                </defs>
                                <path d="M 0 30 Q 150 0 300 30 L 300 80 Q 150 60 0 80 Z" fill="url(#banner-grad-2)" stroke="#fceabb" strokeWidth="2" />
                            </svg>
                            <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', paddingTop: '20px' }}>
                                <h2 style={{
                                    color: '#2a1b0a',
                                    fontSize: '2.5rem',
                                    letterSpacing: '0.2em',
                                    fontWeight: 'bold',
                                    fontFamily: 'serif',
                                    textTransform: 'uppercase',
                                    margin: 0
                                }}>
                                    {title}
                                </h2>
                            </div>
                        </div>
                    </div>

                    {/* --- BACK FACE (The Cover) --- */}
                    <div style={backFaceStyle}>
                        <CardBack />
                    </div>

                </div>
            </div>
        </AbsoluteFill>
    );
};
