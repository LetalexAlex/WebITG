import { parseSM } from './parser.js';
import { db, init } from './database.js';
import {InputManager} from "./InputManager";

init();


const clearDBbutton = document.querySelector('#clear');
clearDBbutton.addEventListener('click', () => {
    db.delete();
    init();
})

const formSM = document.querySelector('#form-sm');
formSM.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fileInput = e.target.querySelector('#fileInput-sm');
    const file = fileInput.files[0];
    if (!file) return;

    const text = await file.text();
    const song = parseSM(text); // song.metadata and song.difficulties exist now

    try {
        await db.transaction('rw', db.songs, db.difficulties, db.steps, async () => {

            // 1. Save Song Metadata
            const songId = await db.songs.add({
                title: song.metadata.TITLE || "Unknown",
                subtitle: song.metadata.SUBTITLE || "",
                artist: song.metadata.ARTIST || "Unknown",
                bpms: song.metadata.BPMS || "0.000=0.000",
                banner: song.metadata.BANNER,
                music: song.metadata.MUSIC,
                offset: parseFloat(song.metadata.OFFSET) || 0,
                sourceType: 'local',
            });

            // 2. Loop through your parsed difficulties
            if (song.difficulties && song.difficulties.length > 0) {
                for (const diffData of song.difficulties) {

                    // 3. Save Difficulty Metadata to 'difficulties' table
                    const diffId = await db.difficulties.add({
                        songId: songId,
                        stepsType: diffData.stepsType.trim(),
                        difficulty: diffData.difficulty.trim(),
                        meter: parseInt(diffData.meter) || 0,
                        stepsArtist: diffData.stepsArtist.trim(),
                        // radarValues is preserved but not indexed
                        radarValues: diffData.radarValues
                    });

                    // 4. Save the actual "0001" string to 'steps' table
                    await db.steps.add({
                        difficultyId: diffId,
                        noteData: diffData.notes.trim()
                    });
                }
            }
        });

        console.log(`Saved "${song.metadata.TITLE}" with ${song.difficulties.length} charts.`);
        if(InputManager.onReload)
            InputManager.onReload();
    } catch (err) {
        console.error("Database Transaction Failed:", err);
    }
});

InputManager.init();
/*
const formZIP = document.querySelector('#form-zip');
formZIP.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log("submitted");
    const fileInput = e.target.querySelector('#fileInput-zip');
    const file = fileInput.files[0];
    if (!file) return;

    const text = await file.text();
    const song = parseSM(text);

    // Save to Local Database (Dexie)
    try {
        await db.songs.add({
            title: song.metadata.TITLE,
            packId: 0,
            subtitle: song.metadata.SUBTITLE,
            artist: song.metadata.ARTIST,
            bpms: song.metadata.BPMS, // Note: BPMs in SM files can be complex strings
            banner: song.metadata.BANNER,
            cdtitle: song.metadata.CDTITLE,
            credit: song.metadata.CREDIT,
            music: song.metadata.MUSIC,
            offset: song.metadata.offset,
            sample_length: song.metadata.sample_length,
            sample_start: song.metadata.sample_start,
            sourceType: 'local',
        });
        console.log("Song should be saved to local DB!");
    } catch (err) {
        console.error("Failed to save:", err);
    }
});
 */