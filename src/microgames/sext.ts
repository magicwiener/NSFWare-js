import { Sprite, Text, Texture, Ticker } from "pixi.js"
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../config";
import { getApp, getSceneManager } from "../main";
import { GameConfig, Microgame } from "../microgame";
import { collides, initSprite } from "../util/util";
import controls from "../controls";

export class Sext extends Microgame {

    private time: number = 0
    private timerText: Text;
    private time: number = 0

    constructor() {
        super("sext")
        this.start()
    }

    getConfig(): GameConfig {
        return {
            title: "Sext",
            bgColor: '#6D57F6',
            textColor: '#59C3F9',
            gameId: this.name
        }
    }

    async start() {
        this.timerText = new Text({
            text: '5',
            style: {
                fill: '#6D57F6',
                fontSize: 36,
            },
            anchor: 0.5
        });
        this.timerText.position.set(CANVAS_WIDTH * 0.1, CANVAS_HEIGHT * 0.9)
        this.addChild(this.timerText)
    }



    update(ticker: Ticker) {
        getApp().renderer.background.color = '#EB4F99'
        this.time += ticker.deltaMS;
        const timeSec = Math.trunc(this.time / 1000)
        this.timerText.text = timeSec
        if (timeSec >= 5) {
            getSceneManager().lose();
        }
        if (controls.state.Enter) {
            controls.state.Enter = false;
            getSceneManager().win()
        }
    }


}