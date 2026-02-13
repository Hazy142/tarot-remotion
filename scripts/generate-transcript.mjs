import path from 'path';
import { execSync } from 'child_process';
import fs from 'fs';
import { transcribe, toCaptions } from '@remotion/install-whisper-cpp';
import ffmpegPath from 'ffmpeg-static';

const PROJECT_ROOT = process.cwd();
const WHISPER_FOLDER = path.join(PROJECT_ROOT, 'whisper.cpp');
const AUDIO_INPUT = 'F:/lunarloom_Lab/video-scripts/DerNarr_audio.mp3.mp3';
const AUDIO_WAV = path.join(PROJECT_ROOT, 'src', 'data', 'DerNarr_audio.wav');
const OUTPUT_JSON = path.join(PROJECT_ROOT, 'src', 'data', 'DerNarr_transcript.json');

async function main() {
    // Check if WAV already exists to skip conversion
    if (!fs.existsSync(AUDIO_WAV)) {
        console.log('🎵 Step 1: Converting audio to 16kHz WAV...');
        fs.mkdirSync(path.dirname(AUDIO_WAV), { recursive: true });
        execSync(
            `"${ffmpegPath}" -i "${AUDIO_INPUT}" -ar 16000 -ac 1 -c:a pcm_s16le "${AUDIO_WAV}" -y`,
            { stdio: 'inherit' }
        );
        console.log('   ✅ Audio converted!');
    } else {
        console.log('🎵 Step 1: WAV already exists, skipping conversion.');
    }

    console.log('📝 Step 2: Transcribing audio with Whisper.cpp (German)...');
    const whisperOutput = await transcribe({
        inputPath: AUDIO_WAV,
        whisperPath: WHISPER_FOLDER,
        whisperCppVersion: '1.5.5',
        model: 'medium',
        tokenLevelTimestamps: true,
        language: 'de',
        printOutput: true,
        onProgress: (progress) => {
            console.log(`  Progress: ${(progress * 100).toFixed(1)}%`);
        },
    });

    console.log('✨ Step 3: Converting to captions format...');
    // Use toCaptions (not deprecated convertToCaptions)
    const { captions } = toCaptions({ whisperCppOutput: whisperOutput });

    console.log(`💾 Saving transcript to: ${OUTPUT_JSON}`);
    fs.writeFileSync(OUTPUT_JSON, JSON.stringify(captions, null, 2));

    console.log('✅ Done! Transcript saved.');
    console.log(`\nPreview (first 5 captions):`);
    captions.slice(0, 5).forEach((c, i) => {
        console.log(`  ${i + 1}. [${(c.startMs / 1000).toFixed(2)}s] "${c.text}"`);
    });
}

main().catch(console.error);
