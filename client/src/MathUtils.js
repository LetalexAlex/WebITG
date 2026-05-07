export function calculateTotalDuration(dataString, totalBeats) {
    const changes = dataString.trim().split(/\s*,\s*/)
        .map(line => {
            const [pos, bpm] = line.split('=').map(Number);
            return { pos, bpm };
        })
        .sort((a, b) => a.pos - b.pos);

    let totalSeconds = 0;

    for (let i = 0; i < changes.length; i++) {
        const current = changes[i];

        // Determine the end point for this segment:
        // It's either the next BPM change OR the end of the song.
        const nextPos = (i + 1 < changes.length)
            ? changes[i + 1].pos
            : totalBeats;

        const delta = nextPos - current.pos;

        // Only add time if the song actually continues past this point
        if (delta > 0) {
            totalSeconds += (delta / current.bpm) * 60;
        }
    }

    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.round(totalSeconds % 60);

    return `${mins}:${secs.toString().padStart(2, '0')}`;
}