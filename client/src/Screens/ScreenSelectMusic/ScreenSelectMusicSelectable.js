import {Button} from "../../pixi/Button";
import {Text} from "pixi.js";

export class ScreenSelectMusicSelectable extends Button {
    selected = false;
    constructor(label, y, subtitle) {
        // 630x48 in 720p, 1200x96
        super(label, 1000 ,y, 1200, 96, "#FFFFFF22", "#FFFFFF", 50, 'Fredoka', null);
        if(subtitle) {
            this.subtitle = new Text({
                text: subtitle,
                style: {fill: this.textColor, fontSize: this.fontSize - 20, fontFamily: this.fontFamily}
            });
            this.addChild(this.subtitle);
            this.subtitle.x += 20
            this.subtitle.y += 55
        }
        this.init();
    }
    init() {
        this.text.x += 20
    }
    setSelected(selected) {
        console.debug("selected: " + selected);
        this.selected = selected;
        if(this.selected) {
            this.boxColor = "#FFFFFF44";
        } else {
            this.boxColor = "#FFFFFF22";
        }
        this.redrawBox()
    }

}