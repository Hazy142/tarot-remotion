import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Cinzel';
import { loadFont as loadSecondaryFont } from '@remotion/google-fonts/Lato';
import { TarotCardVisual } from './TarotCardVisual';

const { fontFamily } = loadFont();
const { fontFamily: secondaryFont } = loadSecondaryFont();

export interface TarotInfoCardProps {
    title: string;
    number: string;
    imageSrc: string;
    meaning: {
        heading: string;
        text: string;
    };
    correspondences: {
        element: string;
        planet: string;
        zodiac?: string;
    };
    daily: {
        heading: string;
        love: string;
        career: string;
        spirit: string;
    };
    shadow: {
        heading: string;
        text: string;
    };
    frontTemplateSrc: string;
    // Opacity prop to hide the card visual if we are rendering it separately in 3D
    showCardVisual?: boolean;
}

export const TarotInfoCard: React.FC<TarotInfoCardProps> = ({
    title,
    number,
    imageSrc,
    meaning,
    correspondences,
    daily,
    shadow,
    frontTemplateSrc,
    showCardVisual = true
}) => {
    const resolve = (src: string) => {
        if (src.startsWith('http')) return src;
        const cleanSrc = src.startsWith('/') ? src.slice(1) : src;
        return staticFile(cleanSrc);
    }

    return (
        <AbsoluteFill style={{ backgroundColor: '#1a1025', color: '#f0e6d2', fontFamily }}>
            {/* Background Template - Assuming it fits this layout or we overlay on it */}
            <Img src={resolve(frontTemplateSrc)} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />

            {/* Main Container Grid */}
            <AbsoluteFill style={{
                display: 'grid',
                gridTemplateRows: '38% 8% 25% 15% 14%', // Based on visual inspection of unnamed.png
                padding: '40px 60px',
                gap: '10px'
            }}>

                {/* 1. Top Section: Centered Card */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                    {/* Placeholder for positioning 3D card over, or rendering static */}
                    <div style={{ width: '380px', height: '100%' }}>
                        {showCardVisual && <TarotCardVisual imageSrc={imageSrc} />}
                    </div>

                    {/* Number Badge (Overlay on top of arc?) - Moving to Title for now as in reference it's just "0" above */}
                    <div style={{
                        position: 'absolute',
                        top: '-10px',
                        zIndex: 10,
                        width: '60px',
                        height: '60px',
                        background: '#1a1025',
                        border: '2px solid #eacc85',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '28px',
                        color: '#f4e4bc',
                        boxShadow: '0 0 10px rgba(0,0,0,0.5)'
                    }}>
                        {number}
                    </div>
                </div>

                {/* 2. Title Section */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* Ribbon effect could be added here */}
                    <h1 style={{
                        fontSize: '56px',
                        margin: 0,
                        color: '#f4e4bc',
                        textTransform: 'uppercase',
                        textShadow: '0 2px 5px rgba(0,0,0,0.8)'
                    }}>{title}</h1>
                </div>

                {/* 3. Middle Section: Meaning & Correspondences */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px' }}>
                    {/* Left: Core Meaning */}
                    <div>
                        <h3 style={{ fontSize: '24px', color: '#eacc85', borderBottom: '1px solid rgba(234, 204, 133, 0.3)', marginBottom: '10px' }}>
                            {meaning.heading}
                        </h3>
                        <p style={{ fontFamily: secondaryFont, fontSize: '18px', lineHeight: '1.5', color: '#e0d5c1' }}>
                            {meaning.text}
                        </p>
                    </div>

                    {/* Right: Correspondences */}
                    <div>
                        <h3 style={{ fontSize: '24px', color: '#eacc85', borderBottom: '1px solid rgba(234, 204, 133, 0.3)', marginBottom: '10px', textAlign: 'right' }}>
                            Kosmos
                        </h3>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ marginBottom: '15px' }}>
                                <strong style={{ color: '#cfb570', fontSize: '14px', textTransform: 'uppercase' }}>Element</strong>
                                <div style={{ fontSize: '24px' }}>{correspondences.element}</div>
                            </div>
                            <div>
                                <strong style={{ color: '#cfb570', fontSize: '14px', textTransform: 'uppercase' }}>Planet</strong>
                                <div style={{ fontSize: '24px' }}>{correspondences.planet}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Daily Interpretation */}
                <div style={{ borderTop: '1px solid rgba(234, 204, 133, 0.2)', paddingTop: '15px' }}>
                    <h3 style={{ fontSize: '20px', color: '#eacc85', textAlign: 'center', marginBottom: '15px' }}>Deutung im Alltag</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', fontFamily: secondaryFont }}>
                        <div style={{ textAlign: 'center' }}>
                            {/* Icon placeholder */}
                            <strong style={{ display: 'block', color: '#cfb570' }}>Liebe</strong>
                            <p style={{ fontSize: '14px', marginTop: '5px' }}>{daily.love}</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <strong style={{ display: 'block', color: '#cfb570' }}>Karriere</strong>
                            <p style={{ fontSize: '14px', marginTop: '5px' }}>{daily.career}</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <strong style={{ display: 'block', color: '#cfb570' }}>Spirituell</strong>
                            <p style={{ fontSize: '14px', marginTop: '5px' }}>{daily.spirit}</p>
                        </div>
                    </div>
                </div>

                {/* 5. Shadow Side */}
                <div style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255, 0, 0, 0.1), transparent)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '10px'
                }}>
                    <h3 style={{ fontSize: '20px', color: '#ff8e8e', marginBottom: '5px' }}>{shadow.heading}</h3>
                    <p style={{ fontFamily: secondaryFont, fontSize: '16px', fontStyle: 'italic', color: '#ffbaba', textAlign: 'center' }}>
                        {shadow.text}
                    </p>
                </div>

            </AbsoluteFill>
        </AbsoluteFill>
    );
};
