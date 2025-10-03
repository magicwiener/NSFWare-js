import { Text, Ticker } from "pixi.js";
import { Scene } from "../scene";
import controls from "../controls";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../config";
import { initSprite } from "../util/util";

export class YouHaveLostScene extends Scene {
    constructor() {
        super("game-over")
        this.init()
    }

    async init(): void {
        let background = await initSprite('/assets/background_clouds.png')
        background.width = CANVAS_WIDTH
        background.height = CANVAS_HEIGHT
        background.position.set(0, 0)
        this.addChild(background)
        const myText = new Text({
            text: 'you have lost!\n\ncover your head in ashes\n\npress ENTER to restart',
            style: {
                fill: '#333',
                fontSize: 36,
                align: 'center'
            },
            anchor: 0.5
        });
        myText.position.set(320, 200)
        this.addChild(myText)
    }

    update(ticker: Ticker): void {
        if (controls.state.Enter) {
            window.location.reload();
        }
    }
}