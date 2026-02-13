/**
 * FlipTest Presets Index
 * 
 * Import all preset JSON files and export them as a typed map.
 * Add new presets here after creating them in the presets/ folder.
 */

import defaultPreset from './presets/default.json';
import zoomClosePreset from './presets/zoom-close.json';
import meinPreset from './presets/mein-preset.json';

export type FlipPreset = {
    name: string;
    description?: string;
    durationInSeconds: number;
    cardWidth: number;
    cardHeight: number;
    cardTopPercent: number;
    perspective: number;
    spinCount: number;
    spinDurationFrames: number;
    fadeInDuration: number;
    scalePop: number;
    cameraKeyframes: Array<{
        timeInSeconds: number;
        zoom: number;
        offsetX: number;
        offsetY: number;
    }>;
    frontImage: string;
    backImage: string;
};

// Register all presets here
export const presets: Record<string, FlipPreset> = {
    'default': defaultPreset as FlipPreset,
    'zoom-close': zoomClosePreset as FlipPreset,
    'mein-preset': meinPreset as FlipPreset,
};

// List of preset names for the Zod enum
export const presetNames = Object.keys(presets) as [string, ...string[]];

export const getPreset = (name: string): FlipPreset | undefined => presets[name];
