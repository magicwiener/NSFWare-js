import { Text, HTMLText, Sprite, Ticker } from "pixi.js";
import { Scene } from "../scene";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../config";
import { initSprite } from "../util/util";
import { getApp, getSceneManager } from "../main";
import { GameConfig } from "../microgame";

const DURATION = 1000;

/**
 * This scene is show each time player wins
 */
export class GameName extends Scene {
    private time: number = 0

    constructor(
        private config: GameConfig
    ) {
        super("gameName")
        this.init();
    }

    async init() {
        const hint = new Text({
            text: this.config.title,
            style: {
                fill: this.config.textColor,
                fontSize: 28,
                fontFamily: 'Impact',
            },
            anchor: 0.5
        });
        this.addChild(hint)
        hint.position.set(CANVAS_WIDTH * 0.21, CANVAS_HEIGHT * 0.22)
    }

    update(ticker: Ticker): void {
        getApp().renderer.background.color = this.config.bgColor;
        this.time += ticker.deltaMS;
        if (this.time  > DURATION) {
            getSceneManager().setScene(this.config.gameId)
        }
    }
}