import Dexie from 'dexie';

export let db;
export function init() {
    // Initialize the database
    db = new Dexie('ITGCloneDB')

    // Define the schema
    // The '++id' means it will auto-increment the ID for every song you add.
    // We only list the fields we want to "index" (search/sort by).
    db.version(1).stores({
        packs: '++id, name',
        songs: '++id, packId, title, subtitle, artist, bpms, sourceType',
        difficulties: '++id, songId, stepsType, difficulty, meter',
        steps: '++id, difficultyId'
    });

    console.info("[init()] Initialized databases.");
}

export async function getSongs() {
    return await db.songs.toArray()
}

export async function getDifficulties(songID) {
    return await db.difficulties.where('songId').equals(songID).toArray();
}