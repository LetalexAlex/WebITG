import {Container} from "pixi.js";
import {AddButton} from "../../pixi/Button";
import {ScreenSelectMusicSelectable} from "./ScreenSelectMusicSelectable";
import {getSongsTitles} from "../../database";

export class ScreenSelectMusic extends Container {
    constructor() {
        super();
        this.init();
    }
    async init() {

        const titles = await getSongsTitles()
        console.log(titles);
        const selectables = [];
        let y = 0;
        titles.forEach(title => {
            console.log(title);
            const selectable = new ScreenSelectMusicSelectable(title, y);
            selectables.push(selectable);
            this.addChild(selectable);
            y += 98;
        });
        selectables[0].setSelected(true)

        const uploadFile = new AddButton("Upload SM", 0, 0, 100, 25, "#AAAAAA", "#000000", 18, 'Fredoka', () =>{
            document.querySelector('#fileInput-sm').click();
        })
        this.addChild(uploadFile);

        const submitSM = new AddButton("Save SM", 150, 0, 100, 25, "#AAAAAA", "#000000", 18, 'Fredoka', () =>{
            document.querySelector('#submit-sm').click();
        })
        this.addChild(submitSM);
    }
}