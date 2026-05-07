import {Button} from "../../pixi/Button";

export class ScreenSelectMusicMeter extends Button {
    selected = false;
    constructor(label,y) {
        super(" " + label, 700, y, 100, 100, "#FFFFFF22", "#FFFFFF", 100, 'Wendy', null);
        this.init();
    }
    init() {
        this.text.y = this.text.y - 17;
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