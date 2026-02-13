import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const csvPath = path.join(process.cwd(), 'tarot.csv');
const jsonPath = path.join(process.cwd(), 'src', 'data', 'tarot-cards.json');

// Ensure data directory exists
const dataDir = path.dirname(jsonPath);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

console.log('Reading CSV from:', csvPath);
const fileContent = fs.readFileSync(csvPath, 'utf8');

const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
});

console.log(`Found ${records.length} records.`);

const cards = records.map((record) => {
    return {
        category: record['Kategorie'],
        number: record['Nummer'],
        name: record['Name'],
        englishName: record['Englisch'],
        element: record['Element'],
        planetSign: record['Planet/Sternzeichen'],
        numerology: record['Numerologie'],
        upright: record['Aufrecht'],
        reversed: record['Umgekehrt'],
        love: record['Liebe'],
        career: record['Karriere'],
        spirituality: record['Spiritualität'],
        keywords: record['Keywords'],
        imageSrc: '' // Placeholder for now
    };
});

fs.writeFileSync(jsonPath, JSON.stringify(cards, null, 2));
console.log('Wrote JSON to:', jsonPath);
