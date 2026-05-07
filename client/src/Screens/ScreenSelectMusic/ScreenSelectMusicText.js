import {Container, Text} from "pixi.js";

export class ScreenSelectMusicText extends Container {
    constructor(text, fontSize, x, y) {
        super();

        this.text = new Text( {
            text: text,
            style: {fill: "#FFFFFF", fontSize: fontSize, fontFamily: "Fredoka"}
        });
        this.x = x;
        this.y = y;

        this.addChild(this.text);
    }
}