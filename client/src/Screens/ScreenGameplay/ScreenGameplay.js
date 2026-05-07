import {Container} from "pixi.js";
import {getDifficulty, getSong, getSteps} from "../../database";
import {ScreenGameplayText} from "./ScreenGameplayText";

export class ScreenGameplay extends Container {
    constructor(data) {
        super();

        console.warn("REACHED ScreenGameplay WITH DATA: " + JSON.stringify(data));
        this.init(data);
    }
    async init(data) {
        this.stepsData = (await getSteps(data.difficultyId))[0];
        console.log("stepsData: " + JSON.stringify(this.stepsData));
        this.difficultyData = (await getDifficulty(data.difficultyId))[0];
        console.log("difficultyData: " + JSON.stringify(this.difficultyData));
        this.songData = (await getSong(this.difficultyData.songId))[0];
        console.log("songData: " + JSON.stringify(this.songData));


        let titleText = new ScreenGameplayText(this.songData.title, 30, 100, 100)
        this.addChild(titleText);
        let bpms = this.songData.bpms.split("=")
        let bpmText = new ScreenGameplayText(Math.max(parseFloat(bpms[0]), parseFloat(bpms[1])), 30, 100, 150)
        this.addChild(bpmText);
    }
}