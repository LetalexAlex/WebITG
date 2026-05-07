export function calculateTotalDuration(dataString, totalMeasures, beatsPerMeasure = 4) {
    // 1. Parse the string into an array of objects { measure, bpm }
    const changes = dataString
        .trim()
        .split(',')
        .map(line => {
            const [measure, bpm] = line.split('=').map(Number);
            return { measure, bpm };
        })
        .sort((a, b) => a.measure - b.measure);

    let totalSeconds = 0;

    for (let i = 0; i < changes.length; i++) {
        const current = changes[i];
        // The "end" of this BPM section is either the next change or the song end
        const nextMeasure = (i + 1 < changes.length)
            ? changes[i + 1].measure
            : totalMeasures;

        const measureCount = nextMeasure - current.measure;
        const segmentBeats = measureCount * beatsPerMeasure;
        const segmentSeconds = (segmentBeats / current.bpm) * 60;

        totalSeconds += segmentSeconds;
    }

    return {
        rawSeconds: totalSeconds,
        minutes: Math.floor(totalSeconds / 60),
        seconds: Math.floor(totalSeconds % 60)
    };
}