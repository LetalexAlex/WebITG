import { Container, Graphics } from "pixi.js";

export class ScreenSelectMusicNPSGraph extends Container {
    constructor(steps, width = 600, height = 100) {
        super();

        this.stepsData = steps;
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
        this.playhead = new Graphics();

        this.addChild(this.bg);
        this.addChild(this.graph);
        this.addChild(this.playhead);

        this.drawGraph(measureWeights);
    }

    drawGraph(weights) {
        const maxNotes = Math.max(...weights, 1); // Avoid division by zero
        const barWidth = this.graphWidth / weights.length;

        // Draw Background (optional)
        this.bg.beginFill(0x000000, 0.3);
        this.bg.drawRect(0, 0, this.graphWidth, this.graphHeight);
        this.bg.endFill();

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

        // Draw Playhead (initial position)
        this.playhead.beginFill(0xFFFFFF);
        this.playhead.drawRect(0, 0, 2, this.graphHeight);
        this.playhead.endFill();

        this.totalMeasures = weights.length;
    }

    /**
     * Call this from your game loop
     * @param {number} currentMeasure - e.g., 12.5
     */
    update(currentMeasure) {
        const ratio = currentMeasure / this.totalMeasures;
        this.playhead.x = Math.min(ratio * this.graphWidth, this.graphWidth);
    }
}