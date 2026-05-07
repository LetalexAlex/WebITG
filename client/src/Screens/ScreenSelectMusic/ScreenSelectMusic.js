import {Container} from "pixi.js";
import {Button} from "../../pixi/Button";
import {ScreenSelectMusicSelectable} from "./ScreenSelectMusicSelectable";
import {getDifficulties, getSongs, getSteps} from "../../database";
import {InputManager} from "../../InputManager";
import {ScreenSelectMusicMeter} from "./ScreenSelectMusicMeter";
import {ScreenSelectMusicText} from "./ScreenSelectMusicText";
import {ScreenSelectMusicNPSGraph} from "./ScreenSelectMusicNPSGraph";
import {calculateTotalDuration} from "../../MathUtils";

export class ScreenSelectMusic extends Container {
    constructor(onEnterSong) {
        super();

        this.onSongEnter = onEnterSong;

        this.listContainer = new Container();
        this.addChild(this.listContainer);
        this.selectables = []
        this.selectedSelectable = 0;

        this.meterContainer = new Container();
        this.addChild(this.meterContainer);
        this.meterSelectables = []
        this.selectedMeter = 0;

        this.infoPanel = new Container();
        this.addChild(this.infoPanel);

        this.songs = null;
        this.meters = null;

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
            const selectable = new ScreenSelectMusicSelectable(song.title, y, song.subtitle);

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

        console.log("Reloaded Songs!");

        await this.refreshDifficulties();
        await this.showSongInfo(this.songs[this.selectedSelectable]);
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
        await this.showSongInfo(this.songs[this.selectedSelectable]);
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
        await this.showSongInfo(this.songs[this.selectedSelectable])
    }

    async refreshDifficulties() {
        this.meterContainer.removeChildren().forEach(child => child.destroy({ children: true }));
        this.meterSelectables = []

        this.meters = await getDifficulties(this.songs[this.selectedSelectable].id);
        this.meters = this.meters.filter(x => x.stepsType.trim() === "dance-single");

        let y = 500;
        for (let i = 0; i < this.meters.length; i++) {
            const meter = this.meters[i];
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
        console.debug   ("Reloaded difficulties!")
    }

    async enterSong() {
        const selectedSong = this.songs[this.selectedSelectable];
        const selectedDifficulty = this.meters[this.selectedMeter];
        //console.warn(selectedDifficulty)
        if (selectedSong && selectedDifficulty) {
            //console.warn(`Playing ${selectedSong.title} [${selectedDifficulty.meter}]`);
            this.onSongEnter('ScreenGameplay', {
                difficultyId: selectedDifficulty.id
            });
        }
    }

    async showSongInfo(songData) {
        this.infoPanel.removeChildren().forEach(child => child.destroy({ children: true }));
        const smallInfo = new Container();

        smallInfo.y = 300

        const artistText = new ScreenSelectMusicText(`ARTIST ${songData.artist}`, 40, 0, 0)
        smallInfo.addChild(artistText);

        //calculate minmax bpms

        const values = songData.bpms.trim()
            .split(',')
            .map(pair => {
                return parseFloat(pair.split('=')[1].trim());
            })
            .filter(val => !isNaN(val));

        const min = Math.min(...values);
        const max = Math.max(...values);
        let text;

        if(min - max === 0) {
            text = Math.round(max);
        } else {
            text = `${Math.round(min)} - ${Math.round(max)}`;
        }
        let bpmText = new ScreenSelectMusicText(`BPM ${text}`, 40, 0, 50);
        smallInfo.addChild(bpmText);



        this.infoPanel.addChild(smallInfo);

        let diff = this.meters[this.selectedMeter]
        // console.warn(diff);

        let steps = (await getSteps(diff.id))[0];
        // console.warn(steps);

        let duration = calculateTotalDuration(songData.bpms.trim(), (steps.noteData.trim().match(/,/gm)).length * 4);
        const lengthText = new ScreenSelectMusicText(`LENGTH ${duration}`, 40, 300, 50);
        smallInfo.addChild(lengthText);

        let stepsArtist = new ScreenSelectMusicText(`STEPS: ${diff.stepsArtist}`, 30, 0, 450, 650, 50, "#FFFFFF");
        this.infoPanel.addChild(stepsArtist);
        let NPSGraph = new ScreenSelectMusicNPSGraph(steps, 0, 510, 650, 175);
        this.infoPanel.addChild(NPSGraph);
    }


    async init() {
        const uploadFile = new Button("Upload SM", 0, 0, 100, 25, "#AAAAAA", "#000000", 18, 'Fredoka', () =>{
            document.querySelector('#fileInput-sm').click();
        })
        this.addChild(uploadFile);

        const submitSM = new Button("Save SM", 150, 0, 100, 25, "#AAAAAA", "#000000", 18, 'Fredoka', () =>{
            document.querySelector('#submit-sm').click();
        })
        this.addChild(submitSM);

        const resetDB = new Button("CLEAR DB", 300, 0, 100, 25, "#AAAAAA", "#000000", 18, 'Fredoka', () =>{
            document.querySelector('#clear').click();
        })
        this.addChild(resetDB);

        InputManager.onReload = () => this.refreshSongs();
        InputManager.onScreenSelectMusicPrev = () => this.changeSelection(-1);
        InputManager.onScreenSelectMusicNext = () => this.changeSelection(1);
        InputManager.onScreenSelectMusicMeterPrev = () => this.changeMeter(-1);
        InputManager.onScreenSelectMusicMeterNext = () => this.changeMeter(1);
        InputManager.onScreenSelectEnter = () => this.enterSong();
        await this.refreshSongs();
    }
}