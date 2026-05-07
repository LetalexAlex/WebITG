import { unzipSync } from 'fflate';

export function parseZip(arrayBuffer) {
    const zipData = new Uint8Array(arrayBuffer);
    const fileMap = unzipSync(zipData); // Returns { "path/to/file.sm": Uint8Array, ... }

    const songs = {};

    // 1. Iterate through every file in the zip
    for (const path in fileMap) {
        const pathParts = path.split('/');
        const fileName = pathParts.pop(); // e.g., "song.sm"
        const folderPath = pathParts.join('/'); // e.g., "PackName/SongName"

        // Ignore system files like __MACOSX or hidden files
        if (fileName.startsWith('.') || path.includes('__MACOSX')) continue;

        // Initialize an object for this specific folder if it doesn't exist
        if (!songs[folderPath]) {
            songs[folderPath] = { sm: null, music: null, images: [] };
        }

        // 2. Assign files to their respective song folders
        if (fileName.toLowerCase().endsWith('.sm')) {
            songs[folderPath].sm = new TextDecoder().decode(fileMap[path]);
        } else if (fileName.toLowerCase().endsWith('.mp3') || fileName.toLowerCase().endsWith('.ogg')) {
            songs[folderPath].music = fileMap[path]; // Store as Uint8Array
        } else if (['.png', '.jpg', '.jpeg'].some(ext => fileName.toLowerCase().endsWith(ext))) {
            songs[folderPath].images.push({ name: fileName, data: fileMap[path] });
        }
    }

    return songs;
}

export function parseSM(rawText) {
    const songData = {
        filetype: "sm"
    };
    const metadataRegex = [...rawText.matchAll(/#(?!NOTES)([^:]+):([\s\S]*?);/g)];
    //console.log(metadata)
    songData.metadata = Object.fromEntries(
        // in k/v pair
        metadataRegex.map(([full, key, value]) => [
            key,
            value === "" ? null : value.trim()
        ])
    );
    songData.difficulties = parseNotes(rawText);
    console.log(songData);
    return songData;
}

function parseNotes(rawText) {
    const difficulties = [];
    const regex = /^#NOTES:\s*(.*):\s*(.*):\s*(.*):\s*(.*):\s*(.*):\s([\s\S]+?)\s;/mg
    const match = rawText.matchAll(regex);
    match.forEach((diff) => {
        //console.log(diff);
        const difficulty = {
            stepsType: diff[1],
            stepsArtist: diff[2],
            difficulty: diff[3],
            meter: diff[4],
            radarValues: diff[5],
            notes:diff[6],
        }
        difficulties.push(difficulty);
    })
    return difficulties;
}