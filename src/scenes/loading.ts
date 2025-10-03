import { Text, HTMLText, Sprite, Ticker } from "pixi.js";
import { Scene } from "../scene";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../config";
import { initSprite } from "../util/util";
import { getApp, getSceneManager } from "../main";

/**
 * This scene is show each time player wins
 */
export class LoadingScene extends Scene {
    private background: Sprite
    private animation: Sprite[] = []
    private time: number = 0

    constructor() {
        super("loading")
        this.init();
    }

    reset() {
        this.time = 0;
    }

    async init() {
        let spriteURLS =[]
        for (let i = 17; i<=35; i++) {
            spriteURLS.push(i)
        }
        spriteURLS = spriteURLS.map(i => `/assets/original/sprite0000${i}_32_640x400.png`)

        let animation = await Promise.all(spriteURLS.map(url => initSprite(url)))

        let background = await initSprite(spriteURLS[0])
        this.animation = animation;
        this.background = background;
        background.width = CANVAS_WIDTH
        background.height = CANVAS_HEIGHT
        background.position.set(0, 0)
        this.addChild(background)
    }

    update(ticker: Ticker): void {
        getApp().renderer.background.color = '#F7D64E'
        this.time += ticker.deltaMS;
        const animationFrame = Math.ceil(this.time / 120) % this.animation.length
        if (this.background) {
            this.background.texture = this.animation[animationFrame].texture;
        }
        if (animationFrame == this.animation.length -1) {
            getSceneManager().nextGame()
        }
    }
}