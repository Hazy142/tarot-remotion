import React from 'react';

export const CardBack: React.FC = () => {
    return (
        <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#1a0b2e',
            borderRadius: '80px',
            border: '6px solid #c5a059',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backfaceVisibility: 'hidden', // Essential for 3D flip
            boxShadow: 'inset 0 0 50px rgba(0,0,0,0.8)'
        }}>
            {/* Geometric Pattern Background */}
            <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.1 }}>
                <pattern id="diamond" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 40 20 L 20 40 L 0 20 Z" fill="none" stroke="#c5a059" strokeWidth="1" />
                </pattern>
                <rect x="0" y="0" width="100%" height="100%" fill="url(#diamond)" />
            </svg>

            {/* Central Decoration */}
            <div style={{
                width: '60%',
                height: '40%',
                border: '4px solid #d4af37',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
            }}>
                {/* Inner Circle */}
                <div style={{
                    width: '80%',
                    height: '80%',
                    border: '2px dashed #9b7a28',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: '#d4af37',
                        transform: 'rotate(45deg)'
                    }}></div>
                </div>
                {/* Rays */}
                <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
                    <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#d4af37" strokeWidth="2" opacity="0.5" />
                    <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#d4af37" strokeWidth="2" opacity="0.5" />
                </svg>
            </div>

            <div style={{
                position: 'absolute',
                bottom: '10%',
                color: '#d4af37',
                fontFamily: 'serif',
                letterSpacing: '0.2em',
                fontSize: '1.5rem',
                opacity: 0.6
            }}>
                LUNAR LOOM
            </div>
        </div>
    );
};
