import { Text, Ticker } from "pixi.js";
import { Scene } from "../scene";
import controls from "../controls";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../config";
import { initSprite } from "../util/util";

export class EndingScene extends Scene {
    private time: number = 0
    private label: Text;
    constructor() {
        super("ending")
        this.init()
    }

    async init(): void {
        let background = await initSprite('/assets/background_clouds.png')
        background.width = CANVAS_WIDTH
        background.height = CANVAS_HEIGHT
        background.position.set(0, 0)
        this.addChild(background)
        const myText = new Text({
            text: 'Congratulations!\nYou have won in all 3 games!\nYou are THE ULTIMATE GAMER\n\n\nPress ENTER to restart',
            style: {
                fill: '#333',
                fontSize: 36,
                align: 'center'
            },
            anchor: 0.5
        });
        myText.position.set(320, 200)
        this.addChild(myText)
        this.label = myText;
    }

    update(ticker: Ticker): void {
        if (controls.state.Enter) {
            window.location.reload();
        }
    }

}