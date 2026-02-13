import { Composition, staticFile, getStaticFiles } from 'remotion';
import React from 'react';
import { TarotCard } from './components/TarotCard';
import { DerNarrVideo } from './components/DerNarrVideo';
import { FlipTest, flipTestSchema } from './components/FlipTest';
import {
    TarotAutoVideo,
    tarotAutoVideoSchema,
} from './components/TarotAutoVideo';
import { getPreset } from './data/flipPresets';
import tarotCards from './data/tarot-cards.json';
import narrTranscript from './data/DerNarr_transcript.json';
import './style.css';

// Guard to prevent infinite loop: updateDefaultProps → calculateMetadata → updateDefaultProps
let lastAppliedPreset: string | null = null;

export const RemotionRoot: React.FC = () => {
    // Get all files from the public folder
    const files = getStaticFiles();

    // Helper to find an image for a card
    const getImageForCard = (card: (typeof tarotCards)[0]) => {
        if (!card || !card.name) {
            console.error('Invalid card data:', card);
            return undefined;
        }

        // Normalize names for comparison (remove spaces, lowercase)
        const normalizedName = card.name.toLowerCase().replace(/\s+/g, '_');
        const normalizedEnglishName = (card.nameEnglish || '')
            .toLowerCase()
            .replace(/\s+/g, '_');
        const number = (card.number || '').toString();

        const file = files.find((f) => {
            const lowerName = f.name.toLowerCase();
            const isImage =
                lowerName.endsWith('.png') ||
                lowerName.endsWith('.jpg') ||
                lowerName.endsWith('.jpeg') ||
                lowerName.endsWith('.webp');

            if (!isImage) return false;

            return (
                lowerName.includes(normalizedName) ||
                (normalizedEnglishName &&
                    lowerName.includes(normalizedEnglishName)) ||
                (number && lowerName.includes(`_${number}_`))
            );
        });

        return file ? file.src : undefined;
    };

    // Calculate video duration from transcript
    const lastFragment = narrTranscript[narrTranscript.length - 1];
    const autoDuration = Math.round((lastFragment.endMs / 1000 + 3) * 30); // frames

    return (
        <>
            {/* Render a few example cards to show the system working */}
            {tarotCards.slice(0, 10).map((card) => (
                <Composition
                    key={card.number}
                    id={`TarotCard-${card.number}`}
                    component={TarotCard}
                    durationInFrames={150}
                    fps={30}
                    width={1080}
                    height={1920}
                    defaultProps={{
                        title: card.name,
                        number: card.number,
                        imageSrc: getImageForCard(card),
                        element: card.element,
                    }}
                />
            ))}
            {/* AUTO TAROT VIDEO — Der Narr (mit Studio Controls!) */}
            <Composition
                id="AutoTarot-DerNarr"
                component={TarotAutoVideo}
                schema={tarotAutoVideoSchema}
                durationInFrames={autoDuration}
                fps={30}
                width={1080}
                height={1920}
                defaultProps={{
                    cardWidth: 480,
                    cardHeight: 790,
                    cardTopPercent: 7,
                    perspective: 1000,
                    spinCount: 1,
                    spinDurationFrames: 120,
                    fadeInDuration: 1,
                    scalePop: 1.03,
                    useAutoKeyframes: true,
                    cameraKeyframes: [
                        {
                            timeInSeconds: 0.7,
                            zoom: 3.75,
                            offsetX: 0,
                            offsetY: 13,
                        },
                    ],
                    frameHeightPercent: 30,
                    contentTopPercent: 56.5,
                    bottomSectionTopPercent: 75.5,
                    shadowSectionTopPercent: 88,
                    titleFontSize: 29,
                    bodyFontSize: 17,
                    headingFontSize: 20,
                    cosmicIconSize: 110,
                    meaningIconSize: 160,
                    crystalBallSize: 150,
                    contentPaddingX: 50,
                    columnGap: 40,
                    badgeSize: 60,
                    badgeTopOffset: 20,
                    frontImage: 'Der_Narr_Illustration.png',
                    backImage: 'cut_card_back.png',
                }}
            />
            {/* Der Narr - Full Video Composition (1m15s = 75s) */}
            <Composition
                id="DerNarrVideo"
                component={DerNarrVideo}
                durationInFrames={2250}
                fps={30}
                width={1080}
                height={1920}
            />
            {/* Flip Test with template background — interactive controls in Studio */}
            <Composition
                id="FlipTest"
                component={FlipTest}
                schema={flipTestSchema}
                calculateMetadata={({ props }) => {
                    const presetName = props.presetName as string;

                    // When a preset is selected, override all values with preset data
                    const preset =
                        presetName !== '(custom)'
                            ? getPreset(presetName)
                            : undefined;

                    // Push preset values into the Studio sidebar (with loop guard)
                    if (preset && lastAppliedPreset !== presetName) {
                        lastAppliedPreset = presetName;
                        try {
                            const {
                                updateDefaultProps,
                            } = require('@remotion/studio');
                            updateDefaultProps({
                                compositionId: 'FlipTest',
                                defaultProps: () => ({
                                    ...preset,
                                    presetName: props.presetName,
                                }),
                            });
                        } catch (e) {
                            // Not in Studio context (e.g. during render), ignore
                        }
                    } else if (!preset) {
                        lastAppliedPreset = null;
                    }

                    const merged = preset
                        ? {
                              ...props,
                              durationInSeconds: preset.durationInSeconds,
                              cardWidth: preset.cardWidth,
                              cardHeight: preset.cardHeight,
                              cardTopPercent: preset.cardTopPercent,
                              perspective: preset.perspective,
                              spinCount: preset.spinCount,
                              spinDurationFrames: preset.spinDurationFrames,
                              fadeInDuration: preset.fadeInDuration,
                              scalePop: preset.scalePop,
                              cameraKeyframes: preset.cameraKeyframes,
                              frontImage: preset.frontImage,
                              backImage: preset.backImage,
                          }
                        : props;

                    return {
                        durationInFrames: Math.round(
                            merged.durationInSeconds * 30,
                        ),
                        fps: 30,
                        width: 1080,
                        height: 1920,
                        props: merged,
                    };
                }}
                durationInFrames={150}
                fps={30}
                width={1080}
                height={1920}
                defaultProps={{
                    presetName: 'mein-preset' as const,
                    durationInSeconds: 5,
                    cardWidth: 420,
                    cardHeight: 660,
                    cardTopPercent: 5.5,
                    perspective: 1000,
                    spinCount: 6,
                    spinDurationFrames: 120,
                    fadeInDuration: 15,
                    scalePop: 1.03,
                    cameraKeyframes: [
                        { timeInSeconds: 0, zoom: 2, offsetX: 0, offsetY: -15 },
                        { timeInSeconds: 3, zoom: 1, offsetX: 0, offsetY: 0 },
                        {
                            timeInSeconds: 8.5,
                            zoom: 2.55,
                            offsetX: -23.5,
                            offsetY: 4,
                        },
                    ],
                    frontImage: 'Der_Narr_Illustration.png',
                    backImage: 'cut_card_back.png',
                }}
            />
        </>
    );
};
