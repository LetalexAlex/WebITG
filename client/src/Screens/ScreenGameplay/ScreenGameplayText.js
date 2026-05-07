import {Container, Text} from "pixi.js";

export class ScreenGameplayText extends Container {
    constructor(text, fontSize, x, y) {
        super();

        this.box = new Container();
        this.text = new Text( {
            text: text,
            style: {fill: "#FFFFFF", fontSize: fontSize, fontFamily: "Fredoka"}
        });
        this.box.x = x;
        this.box.y = y;

        this.box.addChild(this.text);
        this.addChild(this.box);
    }
    setText(text) {
        this.text.text = text;
    }
}