export const derNarrData = {
    title: "DER NARR",
    number: "0",
    // Ensure these images are in public/ folder
    imageSrc: "Der_Narr_Illustration.png",
    backImageSrc: "tarot_template_back.png",
    frontTemplateSrc: "tarot_template_front.png",
    meaning: {
        heading: "Kernbedeutung & Symbolik",
        text: "Neuanfang, Unschuld, Spontaneität, ein freier Geist. Der Narr steht am Anfang einer großen Reise ins Ungewisse."
    },
    correspondences: {
        element: "Luft",
        planet: "Uranus",
        zodiac: "Wassermann"
    },
    daily: {
        heading: "Deutung im Alltag",
        love: "Neue Begegnungen, Risikobereitschaft.",
        career: "Sprung ins kalte Wasser, innovative Ideen.",
        spirit: "Vertraue dem Universum, lass los."
    },
    shadow: {
        heading: "Schattenseite",
        text: "Naivität, Leichtsinn, Dummheit, rücksichtsloses Verhalten."
    }
};

// Camera Focus Points (in % of width/height relative to center)
// Scale 1 = Full View
// Scale > 1 = Zoomed In
export const focusPoints = {
    intro: { x: 0, y: 0, scale: 1 },
    meaning: { x: -20, y: 0, scale: 1.8 },
    correspondences: { x: 20, y: 0, scale: 1.8 },
    daily: { x: -10, y: 25, scale: 1.8 },
    shadow: { x: 25, y: 25, scale: 1.8 },
    full: { x: 0, y: 0, scale: 1 }
};
