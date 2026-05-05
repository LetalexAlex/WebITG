import {Container, Graphics, Text} from "pixi.js";

export class AddButton extends Container {
    box;
    text;

    label;
    width;
    height;
    x;
    y;
    boxColor;
    textColor;
    fontSize;
    fontFamily;
    onClick;
    constructor(label, x,y, width, height, boxColor, textColor, fontSize, fontFamily, onClick) {
        super();

        this.label = label;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.boxColor = boxColor;
        this.textColor = textColor;
        this.fontSize = fontSize;
        this.fontFamily = fontFamily;
        this.onClick = onClick;

        this.position.set(x,y);

        this.box = new Graphics().rect(0,0,width,height).fill(boxColor);
        this.text = new Text( {
            text: label,
            style: {fill: textColor, fontSize: fontSize, fontFamily: fontFamily}
        });

        this.addChild(this.box);
        this.addChild(this.text);
        if(onClick) {
            this.eventMode = "static";
            this.cursor = "pointer";
            this.on("mousedown", onClick);
        }
    }

    redrawBox() {
        this.box.clear()
        this.box.rect(0,0,this.width,this.height).fill(this.boxColor);
    }
}