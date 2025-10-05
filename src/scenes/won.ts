import { Text, Ticker } from "pixi.js";
import { Scene } from "../scene";
import { getSceneManager } from "../main";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../config";
import { initSprite } from "../util/util";

export class YouHaveWonScene extends Scene {
    private time: number = 0
    private textLabel!: Text;
    constructor() {
        super("won")
        this.init()
    }

    async init(): Promise<void> {
        let background = await initSprite('assets/background_clouds.png')
        background.width = CANVAS_WIDTH
        background.height = CANVAS_HEIGHT
        background.position.set(0, 0)
        this.addChild(background)
        const myText = new Text({
            text: 'You did well!\n\nThe next game starts in\n\n 3 \n\n',
            style: {
                fill: '#333',
                fontSize: 36,
                align: 'center',
            },
            anchor: 0.5
        });
        myText.position.set(320, 200)
        this.addChild(myText)
        this.textLabel = myText;
    }

    reset() {
        this.time = 0;
    }

    update(ticker: Ticker): void {
        this.time += ticker.deltaMS
        const timeLeft = Math.trunc((3000 - this.time) / 1000)
        if (this.textLabel) {
            this.textLabel.text = `You did well!\n\nThe next game starts in\n\n ${timeLeft} \n\n`;
            if (this.time > 3000) {
                getSceneManager().nextGame()
            }
        }

    }

}