// description: This example demonstrates how to use a Container to group and manipulate multiple sprites
import {Application, Assets, Container, Graphics, Point, Rectangle, Sprite, Text, TextStyle} from 'pixi.js';
import {AddButton} from "./pixi/Button";
import {ScreenSelectMusic} from "./Screens/ScreenSelectMusic/ScreenSelectMusic";

const LOGICAL_WIDTH = 1920;
const LOGICAL_HEIGHT = 1080;

let SCREEN = "ScreenSelectMusic";

(async () => {
    // Create a new application
    const app = new Application();

    // Initialize the application
    await app.init({ background: '#000000', resizeTo: window });
    window.addEventListener("resize", () => resize(app))
    resize(app)


    await Assets.load({
        src: '../static/fonts/Fredoka-Regular.ttf',
        data: {
            family: 'Fredoka',
        }
    });
    await Assets.load({
        src: '../static/fonts/wendy.ttf',
        data: {
            family: 'Wendy',
        }
    });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

    let screen = new ScreenSelectMusic();
    app.stage.addChild(screen);
    app.ticker.add((time) => {

    });
})();

function resize(app) {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Calculate the scale factor (how much to grow/shrink)
    const scale = Math.min(
        screenWidth / LOGICAL_WIDTH,
        screenHeight / LOGICAL_HEIGHT
    );

    // Apply scale to the stage
    app.stage.scale.set(scale);

    // Center the stage in the window
    app.stage.x = (screenWidth - LOGICAL_WIDTH * scale) / 2;
    app.stage.y = (screenHeight - LOGICAL_HEIGHT * scale) / 2;
}