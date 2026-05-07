import { Container, Graphics } from "pixi.js";

export class ScreenSelectMusicNPSGraph extends Container { // TODO: fix deprecations
    constructor(steps, x, y, width = 600, height = 100) {
        super();

        this.x = x
        this.y = y

        this.stepsData = steps.noteData;
        this.graphWidth = width;
        this.graphHeight = height;

        // 1. Data Parsing
        const cleanData = this.stepsData.replace(';', '');
        const rawMeasures = cleanData.split(',');

        const measureWeights = rawMeasures.map(measureString => {
            const rows = measureString.match(/\d{4}/g) || [];
            return rows.reduce((acc, row) => acc + (row.match(/[124]/g) || []).length, 0);
            // Note: I added [124] to count Taps (1), Hold Starts (2), and Rolls (4)
        });

        // 2. Setup Graphics
        this.bg = new Graphics();
        this.graph = new Graphics();

        this.addChild(this.bg);
        this.addChild(this.graph);

        this.drawGraph(measureWeights);
    }

    drawGraph(weights) {
        const maxNotes = Math.max(...weights, 1); // Avoid division by zero
        const barWidth = this.graphWidth / weights.length;

        // Draw Bars
        weights.forEach((count, i) => {
            if (count === 0) return;

            const barHeight = (count / maxNotes) * this.graphHeight;
            const x = i * barWidth;
            const y = this.graphHeight - barHeight;

            // Color based on density (Green -> Yellow -> Red)
            let color = 0x00FF00;
            if (count > 12) color = 0xFF0000;
            else if (count > 6) color = 0xFFFF00;

            this.graph.beginFill(color, 0.8);
            this.graph.drawRect(x, y, Math.max(1, barWidth), barHeight);
            this.graph.endFill();
        });
    }
}