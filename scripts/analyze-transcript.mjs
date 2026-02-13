import fs from 'fs';

const transcript = JSON.parse(fs.readFileSync('src/data/DerNarr_transcript.json', 'utf8'));

// Keywords to look for
const keywords = [
    { key: 'meaning', phrase: 'Der Narr steht' }, // "Der Narr steht am Rand einer Klippe..."
    { key: 'correspondences', phrase: 'Element' }, // "Element Luft..."
    { key: 'daily', phrase: 'Liebe' }, // "In der Liebe..." (or similar)
    { key: 'shadow', phrase: 'Schatten' } // "Schattenseite"
];

const results = {};

transcript.forEach((item, index) => {
    const text = item.text.trim();

    keywords.forEach(kw => {
        if (!results[kw.key] && text.includes(kw.phrase.split(' ')[0])) {
            // Found potential start, let's check next words if phrase is multi-word
            let match = true;
            const phraseParts = kw.phrase.split(' ');
            if (phraseParts.length > 1) {
                // Check next items
                for (let i = 1; i < phraseParts.length; i++) {
                    if (index + i >= transcript.length || !transcript[index + i].text.includes(phraseParts[i])) {
                        match = false;
                        break;
                    }
                }
            }

            if (match) {
                results[kw.key] = item.timestampMs;
                console.log(`Found ${kw.key} at ${item.timestampMs}ms (${item.timestampMs / 1000}s)`);
            }
        }
    });
});
