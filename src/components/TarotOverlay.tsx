import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';

/** All layout values come as props — directly driven by Studio sliders */
export interface TarotOverlayProps {
    cardName: string;
    number: string;
    keywords: string;
    meaningUpright: string;
    meaningLove: string;
    meaningCareer: string;
    meaningSpirit: string;
    shadowKeywords: string[];
    element?: string;
    planet?: string;
    // Layout (controlled via Studio)
    frameHeightPercent?: number;
    contentTopPercent?: number;
    bottomSectionTopPercent?: number;
    shadowSectionTopPercent?: number;
    titleFontSize?: number;
    bodyFontSize?: number;
    headingFontSize?: number;
    cosmicIconSize?: number;
    meaningIconSize?: number;
    crystalBallSize?: number;
    contentPaddingX?: number;
    columnGap?: number;
    badgeSize?: number;
    badgeTopOffset?: number;
}

export const TarotOverlay: React.FC<TarotOverlayProps> = ({
    cardName,
    number,
    keywords,
    meaningUpright,
    meaningLove,
    meaningCareer,
    meaningSpirit,
    shadowKeywords,
    element = "Luft",
    planet = "Uranus",
    // Layout defaults (same as schema defaults)
    frameHeightPercent = 42,
    contentTopPercent = 50,
    bottomSectionTopPercent = 75,
    shadowSectionTopPercent = 89,
    titleFontSize = 26,
    bodyFontSize = 17,
    headingFontSize = 20,
    cosmicIconSize = 110,
    meaningIconSize = 160,
    crystalBallSize = 150,
    contentPaddingX = 50,
    columnGap = 40,
    badgeSize = 60,
    badgeTopOffset = 20,
}) => {
    // Build CSS custom properties from props → cascades to all children
    const cssVars = {
        '--frame-height': `${frameHeightPercent}%`,
        '--content-top': `${contentTopPercent}%`,
        '--bottom-section-top': `${bottomSectionTopPercent}%`,
        '--shadow-section-top': `${shadowSectionTopPercent}%`,
        '--title-font-size': `${titleFontSize}px`,
        '--body-font-size': `${bodyFontSize}px`,
        '--heading-font-size': `${headingFontSize}px`,
        '--cosmic-icon-size': `${cosmicIconSize}px`,
        '--meaning-icon-size': `${meaningIconSize}px`,
        '--crystal-ball-size': `${crystalBallSize}px`,
        '--content-padding-x': `${contentPaddingX}px`,
        '--column-gap': `${columnGap}px`,
        '--badge-size': `${badgeSize}px`,
        '--badge-top': `${badgeTopOffset}px`,
    } as React.CSSProperties;

    return (
        <AbsoluteFill className="tarot-overlay-final" style={{ pointerEvents: 'none', ...cssVars }}>

            {/* ========================================= */}
            {/* TOP: ARCH WINDOW FRAME + RIBBON (Image!) */}
            {/* ========================================= */}
            <div className="arch-frame-container">
                <Img
                    src={staticFile('karten rahmen.png')}
                    style={{
                        width: '100%',
                        height: 'auto',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        objectFit: 'contain',
                    }}
                />
                {/* Number Badge - positioned over the arch */}
                <div className="number-badge">{number}</div>
            </div>

            {/* ========================================= */}
            {/* MIDDLE: 2-COLUMN LAYOUT */}
            {/* ========================================= */}
            <div className="content-wrapper">

                {/* LEFT COLUMN: Kernbedeutung & Symbolik */}
                <div className="left-column">
                    <h2 className="section-title">KERNBEDEUTUNG & SYMBOLIK</h2>

                    <div className="meaning-block">
                        <h3>Nummer {number}: Der absolute Neubeginn</h3>
                        <p>{meaningUpright}</p>
                    </div>

                    <div className="meaning-block">
                        <h3>Der Sprung aus Vertrauen</h3>
                        <p>Er steht am Abgrund, nicht aus Dummheit, sondern aus purem Vertrauen in die Führung des Universums und die eigene Intuition.</p>
                    </div>

                    <div className="meaning-block">
                        <h3>Die weiße Rose & der Begleiter</h3>
                        <p>Die weiße Rose in der Illustration symbolisiert Reinheit und Unschuld, während der treue Hund den Wanderer vor Gefahren warnt und ihn begleitet.</p>
                    </div>
                </div>

                {/* RIGHT COLUMN: Kosmische Korrespondenzen */}
                <div className="right-column">
                    <h2 className="section-title-right">KOSMISCHE<br />KORRESPONDENZEN</h2>

                    {/* Element Luft */}
                    <div className="cosmic-row">
                        <div className="cosmic-icon">
                            <Img
                                src={staticFile('wind.png')}
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                        </div>
                        <div className="cosmic-text">
                            <h4>Element {element}</h4>
                            <p>Das zugeordnete Element Luft steht für klare Gedanken, neue Perspektiven und die Leichtigkeit des Geistes.</p>
                        </div>
                    </div>

                    {/* Planet Uranus */}
                    <div className="cosmic-row">
                        <div className="cosmic-icon">
                            <Img
                                src={staticFile('planet.png')}
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                        </div>
                        <div className="cosmic-text">
                            <h4>Planet {planet}</h4>
                            <p>Uranus bringt die Energie von Freiheit, Rebellion gegen das Veraltete und plötzliche, lebensverändernde Durchbrüche.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ========================================= */}
            {/* BOTTOM: DEUTUNG IM ALLTAG */}
            {/* ========================================= */}
            <div className="bottom-section">
                <div className="section-header-with-stars">
                    <span className="star">✦</span>
                    <h2>DEUTUNG IM ALLTAG (AUFRECHT)</h2>
                    <span className="star">✦</span>
                </div>

                <div className="meanings-row">
                    {/* Liebe */}
                    <div className="meaning-card">
                        <Img
                            src={staticFile('liebe.png')}
                            className="meaning-icon"
                        />
                    </div>

                    {/* Karriere */}
                    <div className="meaning-card">
                        <Img
                            src={staticFile('karriere.png')}
                            className="meaning-icon"
                        />
                    </div>

                    {/* Spirituell */}
                    <div className="meaning-card">
                        <Img
                            src={staticFile('spiritualität.png')}
                            className="meaning-icon"
                        />
                    </div>
                </div>
            </div>

            {/* ========================================= */}
            {/* VERY BOTTOM: SCHATTENSEITE */}
            {/* ========================================= */}
            <div className="shadow-section-final">
                <div className="section-header-with-stars">
                    <span className="star">✦</span>
                    <h2>DIE SCHATTENSEITE (UMGEKEHRT)</h2>
                    <span className="star">✦</span>
                </div>

                <div className="crystal-balls-row">
                    {[0, 1, 2].map((idx) => (
                        <div key={idx} className="crystal-ball-wrapper">
                            <Img
                                src={staticFile('kugel.png')}
                                className="crystal-ball-img"
                            />
                            {shadowKeywords[idx] && (
                                <p className="shadow-label">{shadowKeywords[idx]}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

        </AbsoluteFill>
    );
};
