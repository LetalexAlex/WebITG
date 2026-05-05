// description: This example demonstrates how to use a Container to group and manipulate multiple sprites
import {Application, Assets, Container, Graphics, Point, Rectangle, Sprite, Text, TextStyle} from 'pixi.js';

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

    const uploadFile = new Container({
        position: new Point(100,200)
    });
    uploadFile.eventMode = 'static';
    uploadFile.cursor = 'pointer';

    uploadFile.on('mousedown', () => {
        const uploadFileDOM = document.querySelector('#fileInput-sm')
        uploadFileDOM.click();
    })

    const fileBox = new Graphics().rect(0,0,100,25).fill(0xFFFFFF);
    const fileText = new Text({
        text: 'Upload SM',
        style: {
            fill: '#000000',
            fontSize: 15,
            fontFamily: 'Fredoka',
        }
    });
    uploadFile.addChild(fileBox);
    uploadFile.addChild(fileText);

    app.stage.addChild(uploadFile);


    //----------------------------------------------------------------------------------------
    const submitSM = new Container({
        position: new Point(300,200)
    });
    submitSM.eventMode = 'static';
    submitSM.cursor = 'pointer';

    submitSM.on('mousedown', () => {
        const submitSMdom = document.querySelector('#submit-sm')
        submitSMdom.click();
    })

    const submitSMbox = new Graphics().rect(0,0,100,25).fill(0xFFFFFF);
    const submitSMtext = new Text({
        text: 'Submit',
        style: {
            fill: '#000000',
            fontSize: 15,
            fontFamily: 'Fredoka',
        }
    });
    submitSM.addChild(submitSMbox);
    submitSM.addChild(submitSMtext);

    app.stage.addChild(submitSM);


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