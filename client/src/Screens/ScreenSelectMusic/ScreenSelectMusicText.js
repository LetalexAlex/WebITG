import {Container, Graphics, Text} from "pixi.js";

export class ScreenSelectMusicText extends Container {
    constructor(text, fontSize, x, y, w, h, BGcolor) {
        super();
        if(w && h && BGcolor){
            this.hasBackground = true;
            this.bg = new Graphics().rect(0,0,w,h).fill(BGcolor);
            this.addChild(this.bg);
        }


        this.text = new Text( {
            text: text,
            style: {fill: (this.hasBackground ? "#000000" : "#FFFFFF"), fontSize: fontSize, fontFamily: "Fredoka"}
        });
        this.x = x;
        this.y = y;

        this.addChild(this.text);
    }
}