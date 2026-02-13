#!/usr/bin/env node
/**
 * FlipTest Preset Manager
 * 
 * Usage:
 *   npm run preset list                          Alle Presets anzeigen
 *   npm run preset save <name> [beschreibung]    Neues Preset speichern
 *   npm run preset show <name>                   Preset-Details anzeigen
 *   npm run preset delete <name>                 Preset löschen
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PRESETS_DIR = path.join(__dirname, '..', 'src', 'data', 'presets');

// Ensure presets directory exists
if (!fs.existsSync(PRESETS_DIR)) {
    fs.mkdirSync(PRESETS_DIR, { recursive: true });
}

const args = process.argv.slice(2);
const command = args[0];

async function run() {
    // === LIST PRESETS ===
    if (command === 'list' || !command) {
        console.log('\n📋 Gespeicherte Presets:\n');
        const files = fs.readdirSync(PRESETS_DIR).filter(f => f.endsWith('.json'));
        if (files.length === 0) {
            console.log('  (keine Presets gefunden)');
        }
        for (const file of files) {
            const preset = JSON.parse(fs.readFileSync(path.join(PRESETS_DIR, file), 'utf-8'));
            const name = path.basename(file, '.json');
            const desc = preset.description || '';
            const keyframes = preset.cameraKeyframes?.length || 0;
            console.log(`  🎬 ${name}`);
            console.log(`     ${desc}`);
            console.log(`     Duration: ${preset.durationInSeconds}s | Keyframes: ${keyframes} | Front: ${preset.frontImage}`);
            console.log('');
        }
        return;
    }

    // === SAVE PRESET ===
    if (command === 'save') {
        const presetName = args[1];
        const description = args.slice(2).join(' ') || '';

        if (!presetName) {
            console.error('❌ Bitte Preset-Name angeben: npm run preset save <name> [beschreibung]');
            process.exit(1);
        }

        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

        console.log(`\n💾 Preset "${presetName}" speichern`);
        console.log('');
        console.log('Kopiere die Props aus dem Remotion Studio (JSON) und füge sie hier ein.');
        console.log('Tipp: Im Studio → Props Panel → Rechtsklick → "Copy as JSON"');
        console.log('Oder gib die Werte manuell ein (leere Zeile = fertig):');
        console.log('');

        const jsonInput = await new Promise((resolve) => {
            let input = '';
            let emptyLines = 0;

            rl.on('line', (line) => {
                if (line.trim() === '') {
                    emptyLines++;
                    if (emptyLines >= 1 && input.trim()) {
                        rl.close();
                    }
                } else {
                    emptyLines = 0;
                    input += line + '\n';
                }
            });

            rl.on('close', () => resolve(input.trim()));
        });

        try {
            const props = JSON.parse(jsonInput);
            const preset = {
                name: presetName,
                description: description,
                ...props,
            };

            const filePath = path.join(PRESETS_DIR, `${presetName}.json`);
            fs.writeFileSync(filePath, JSON.stringify(preset, null, 4) + '\n');
            console.log(`\n✅ Preset gespeichert: ${filePath}`);
            console.log(`   Vergiss nicht, es in src/data/flipPresets.ts zu importieren!`);
        } catch (e) {
            console.error(`\n❌ Fehler beim Parsen: ${e.message}`);
            process.exit(1);
        }
        return;
    }

    // === SHOW PRESET ===
    if (command === 'show') {
        const presetName = args[1];
        if (!presetName) {
            console.error('❌ Bitte Preset-Name angeben: npm run preset show <name>');
            process.exit(1);
        }
        const filePath = path.join(PRESETS_DIR, `${presetName}.json`);
        if (!fs.existsSync(filePath)) {
            console.error(`❌ Preset "${presetName}" nicht gefunden.`);
            process.exit(1);
        }
        console.log(fs.readFileSync(filePath, 'utf-8'));
        return;
    }

    // === DELETE PRESET ===
    if (command === 'delete') {
        const presetName = args[1];
        if (!presetName) {
            console.error('❌ Bitte Preset-Name angeben: npm run preset delete <name>');
            process.exit(1);
        }
        const filePath = path.join(PRESETS_DIR, `${presetName}.json`);
        if (!fs.existsSync(filePath)) {
            console.error(`❌ Preset "${presetName}" nicht gefunden.`);
            process.exit(1);
        }
        fs.unlinkSync(filePath);
        console.log(`🗑️  Preset "${presetName}" gelöscht.`);
        return;
    }

    // === HELP ===
    console.log(`
📦 FlipTest Preset Manager

Befehle:
  npm run preset list                          Alle Presets anzeigen
  npm run preset save <name> [beschreibung]    Neues Preset speichern (interaktiv)
  npm run preset show <name>                   Preset-Details anzeigen
  npm run preset delete <name>                 Preset löschen
`);
}

run().catch(console.error);
