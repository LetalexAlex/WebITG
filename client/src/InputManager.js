// InputManager.js
export const InputManager = {
    onReload: null,
    onScreenSelectMusicNext: null,
    onScreenSelectMusicPrev: null,
    onScreenSelectMusicMeterNext: null,
    onScreenSelectMusicMeterPrev: null,
    onScreenSelectEnter: null,
    init() {
        window.addEventListener('keydown', this.onKeyDown.bind(this));
    },
    onKeyDown(e) {
        switch(e.code) {
            case 'ArrowLeft':  this.trigger('LEFT'); break;
            case 'ArrowDown':  this.trigger('DOWN'); break;
            case 'ArrowUp':    this.trigger('UP'); break;
            case 'ArrowRight': this.trigger('RIGHT'); break;
            case 'KeyR': this.general('RELOAD'); break;
            case 'Enter': this.general('ENTER'); break;
        }
    },
    trigger(direction) {
        // This is where you talk to your Game Logic
        console.debug(`Input received: ${direction}`);
        if(this.onScreenSelectMusicNext && this.onScreenSelectMusicPrev) {
            switch (direction) {
                case 'LEFT': this.onScreenSelectMusicPrev(); break;
                case 'RIGHT': this.onScreenSelectMusicNext(); break;
            }
        }
        if(this.onScreenSelectMusicMeterNext && this.onScreenSelectMusicMeterPrev) {
            switch (direction) {
                case 'UP': this.onScreenSelectMusicMeterPrev(); break;
                case 'DOWN': this.onScreenSelectMusicMeterNext(); break;
            }
        }
        // You could emit an event here that Pixi listens to!
    },
    general(input) {
        console.debug(`[g] Input received: ${input}`);
        if(input === 'RELOAD' && this.onReload) {
            this.onReload();
        }
        if(input === 'ENTER' && this.onScreenSelectEnter) {
            this.onScreenSelectEnter();
        }
    }
};