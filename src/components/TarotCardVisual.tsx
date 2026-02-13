import React from 'react';
import { Img, staticFile } from 'remotion';

interface TarotCardVisualProps {
    imageSrc: string;
    width?: string;
    height?: string;
    style?: React.CSSProperties;
}

export const TarotCardVisual: React.FC<TarotCardVisualProps> = ({
    imageSrc,
    width = '100%',
    height = '100%',
    style
}) => {
    const resolve = (src: string) => {
        if (src.startsWith('http')) return src;
        const cleanSrc = src.startsWith('/') ? src.slice(1) : src;
        return staticFile(cleanSrc);
    }

    return (
        <div style={{
            width,
            height,
            position: 'relative',
            ...style
        }}>
            {/* Main Card Frame/Border */}
            <div style={{
                position: 'absolute',
                inset: 0,
                border: '6px solid #eacc85', // Gold Border
                borderRadius: '50% 50% 0 0 / 15% 15% 0 0', // Arch shape approx using border-radius
                // Better approach for exact arch: Clip Path or SVG mask. 
                // Using simple rounded top for now to match the "Arch" look roughly
                borderTopLeftRadius: '150px',
                borderTopRightRadius: '150px',
                borderBottomLeftRadius: '10px',
                borderBottomRightRadius: '10px',
                overflow: 'hidden',
                backgroundColor: '#1a1025',
                boxShadow: '0 4px 15px rgba(0,0,0,0.6)'
            }}>
                <Img
                    src={resolve(imageSrc)}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: 'scale(1.05)' // Slight zoom to avoid gaps
                    }}
                />

                {/* Inner Glow / Vignette */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at center, transparent 60%, rgba(26, 16, 37, 0.6))',
                    pointerEvents: 'none'
                }} />
            </div>

            {/* Decorative Gold Rim (Simulated) */}
            <div style={{
                position: 'absolute',
                inset: '-4px',
                border: '2px solid #cfb570',
                borderRadius: '152px 152px 12px 12px',
                pointerEvents: 'none',
                opacity: 0.8
            }} />

        </div>
    );
};
