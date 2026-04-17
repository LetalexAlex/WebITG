// description: This example demonstrates how to use a Container to group and manipulate multiple sprites
import { Application, Assets, Container, Sprite, Text, TextStyle} from 'pixi.js';

(async () => {
    // Create a new application
    const app = new Application();

    // Initialize the application
    await app.init({ background: '#1099bb', resizeTo: window });

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

    const myText = new Text({
        text: '67',
        style: {
            fill: '#ffffff',
            fontSize: 30,
            fontFamily: 'Fredoka',
        },
    });
    app.stage.addChild(myText);


    const arrowContainer = new Container();

    app.stage.addChild(arrowContainer);

    const arrowTexture = await Assets.load('../static/noteskins/Devcel/arrow.png');

    const arrowLeft = new Sprite({texture: arrowTexture, anchor: 0.5, x: 0});
    arrowLeft.rotation = Math.PI / 2
    arrowContainer.addChild(arrowLeft);

    const arrowDown = new Sprite({texture: arrowTexture, anchor: 0.5, x: 64});
    arrowDown.rotation = 0
    arrowContainer.addChild(arrowDown);

    const arrowUp = new Sprite({texture: arrowTexture, anchor: 0.5, x: 128});
    arrowUp.rotation = Math.PI
    arrowContainer.addChild(arrowUp);

    const arrowRight = new Sprite({texture: arrowTexture, anchor: 0.5, x: 192});
    arrowRight.rotation = Math.PI / 2 * 3
    arrowContainer.addChild(arrowRight);

    arrowContainer.x = app.screen.width / 5 * 3.5;
    arrowContainer.y = app.screen.height / 5 * 4;

    app.ticker.add((time) => {

    });
})();


function renderSteps(stepsText) {

}