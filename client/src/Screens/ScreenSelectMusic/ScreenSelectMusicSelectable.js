import {Container, Graphics} from "pixi.js";
import {AddButton} from "../../pixi/Button";

export class ScreenSelectMusicSelectable extends AddButton {
    selected = false;
    constructor(label,y, width, height, fontSize, fontFamily) {
        // 630x48 in 720p, 1200x96
        super(label, 1000 ,y, 1200, 96, "#FFFFFF22", "#FFFFFF", 50, 'Fredoka', null);
        this.init();
    }
    init() {

    }
    setSelected(selected) {
        this.selected = selected;
        if(this.selected) {
            this.boxColor = "#FFFFFF44";
        } else {
            this.boxColor = "#FFFFFF22";
        }
        this.redrawBox()
    }

}