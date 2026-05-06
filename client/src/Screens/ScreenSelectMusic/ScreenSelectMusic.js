import {Container} from "pixi.js";
import {AddButton} from "../../pixi/Button";
import {ScreenSelectMusicSelectable} from "./ScreenSelectMusicSelectable";
import {getDifficulties, getSongs} from "../../database";
import {InputManager} from "../../InputManager";
import {ScreenSelectMusicMeter} from "./ScreenSelectMusicMeter";

export class ScreenSelectMusic extends Container {
    constructor() {
        super();
        this.listContainer = new Container();
        this.addChild(this.listContainer);
        this.selectables = []
        this.selectedSelectable = 0;

        this.meterContainer = new Container();
        this.addChild(this.meterContainer);
        this.meterSelectables = []
        this.selectedMeter = 0;

        this.songs = null;
        this.init();
    }
    async refreshSongs() {
        // 1. Nuke the Pixi objects
        this.listContainer.removeChildren().forEach(child => child.destroy({ children: true }));

        // 2. CRITICAL: Nuke the JavaScript references
        this.selectables = [];

        this.songs = await getSongs();
        let y = 0;

        for (let i = 0; i < this.songs.length; i++) {
            const song = this.songs[i];
            const selectable = new ScreenSelectMusicSelectable(song.title, y);

            // Now this array starts fresh at index 0 every time
            this.selectables.push(selectable);
            this.listContainer.addChild(selectable);
            y += 98;
        }

        this.selectedSelectable = 0;

        // Safety check: ensure we actually have songs
        if (this.selectables.length > 0) {
            this.selectables[this.selectedSelectable].setSelected(true);
        }

        console.log("Reloaded Songs!")
        await this.refreshDifficulties()
    }

    async changeSelection(n) {
        this.selectables[this.selectedSelectable].setSelected(false);
        this.selectedSelectable += n;
        if (this.selectedSelectable < 0) {
            this.selectedSelectable = this.selectables.length - 1;
        }
        if (this.selectedSelectable >= this.songs.length) {
            this.selectedSelectable = 0;
        }
        this.selectables[this.selectedSelectable].setSelected(true);
        console.debug("selected: " + this.selectedSelectable);
        await this.refreshDifficulties();
    }

    async changeMeter(n) {
        this.meterSelectables[this.selectedMeter].setSelected(false);
        this.selectedMeter += n;
        if (this.selectedMeter < 0) {
            this.selectedMeter = this.meterSelectables.length - 1;
        }
        if (this.selectedMeter >= this.meterSelectables.length) {
            this.selectedMeter = 0;
        }
        this.meterSelectables[this.selectedMeter].setSelected(true);
        console.debug("selected meter: " + this.selectedMeter);
    }

    async refreshDifficulties() {
        this.meterContainer.removeChildren().forEach(child => child.destroy({ children: true }));
        this.meterSelectables = []

        const meters = await getDifficulties(this.songs[this.selectedSelectable].id);

        let y = 500;
        for (let i = 0; i < meters.length; i++) {
            const meter = meters[i];
            const selectableMeter = new ScreenSelectMusicMeter(meter.meter, y);

            // Now this array starts fresh at index 0 every time
            this.meterSelectables.push(selectableMeter);
            this.meterContainer.addChild(selectableMeter);
            y += 101;
        }
        this.selectedMeter = 0;

        // Safety check: ensure we actually have difficulties
        if (this.meterSelectables.length > 0) {
            this.meterSelectables[this.selectedMeter].setSelected(true);
        }
        console.log("Reloaded difficulties!")
    }

    async init() {
        const uploadFile = new AddButton("Upload SM", 0, 0, 100, 25, "#AAAAAA", "#000000", 18, 'Fredoka', () =>{
            document.querySelector('#fileInput-sm').click();
        })
        this.addChild(uploadFile);

        const submitSM = new AddButton("Save SM", 150, 0, 100, 25, "#AAAAAA", "#000000", 18, 'Fredoka', () =>{
            document.querySelector('#submit-sm').click();
        })
        this.addChild(submitSM);

        const resetDB = new AddButton("CLEAR DB", 300, 0, 100, 25, "#AAAAAA", "#000000", 18, 'Fredoka', () =>{
            document.querySelector('#clear').click();
        })
        this.addChild(resetDB);

        InputManager.onReload = () => this.refreshSongs();
        InputManager.onScreenSelectMusicPrev = () => this.changeSelection(-1);
        InputManager.onScreenSelectMusicNext = () => this.changeSelection(1);
        InputManager.onScreenSelectMusicMeterPrev = () => this.changeMeter(-1);
        InputManager.onScreenSelectMusicMeterNext = () => this.changeMeter(1);
        await this.refreshSongs();
    }
}