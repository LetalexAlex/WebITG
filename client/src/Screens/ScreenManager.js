import {ScreenSelectMusic} from "./ScreenSelectMusic/ScreenSelectMusic";
import {ScreenGameplay} from "./ScreenGameplay/ScreenGameplay";

export class ScreenManager {
    constructor(app) {
        this.app = app;
        this.currentScreen = null;
        this.showScreenSelectMusic();
    }

    showScreenSelectMusic() {
        if (this.currentScreen) this.app.stage.removeChild(this.currentScreen);

        // Pass the navigation logic as a callback
        this.currentScreen = new ScreenSelectMusic((target, data) => {
            if (target === 'ScreenGameplay') {
                this.showScreenGameplay(data);
            }
        });

        this.app.stage.addChild(this.currentScreen);
    }

    showScreenGameplay(data) {
        this.app.stage.removeChild(this.currentScreen);

        // Instantiate the gameplay screen with the song/diff info
        this.currentScreen = new ScreenGameplay(data);
        this.app.stage.addChild(this.currentScreen);
    }
}