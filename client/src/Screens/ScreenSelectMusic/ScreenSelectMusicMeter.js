import {AddButton} from "../../pixi/Button";

export class ScreenSelectMusicMeter extends AddButton {
    selected = false;
    constructor(label,y) {
        super(label, 700, y, 100, 100, "#FFFFFF22", "#FFFFFF", 50, 'Fredoka', null);
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