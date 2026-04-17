import {db} from "./database";

export async function setSongs(divElement) {
    const songs = await db.songs.toArray();
    divElement.innerHTML = '';
    for (let i = 0; i < songs.length; i++) {
        const song = songs[i];
        const child = divElement.appendChild(document.createElement("div"));
        child.classList.add("song");
        child.innerHTML = `LEVEL id=${song.id}: <strong>${song.title}</strong>, raw=${JSON.stringify(song)}`;
    }
    console.debug("[setSongs()] Retrieved songs.")
}