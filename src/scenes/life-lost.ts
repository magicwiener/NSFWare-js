import { Text, Sprite, Ticker } from "pixi.js";
import { Scene } from "../scene";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../config";
import { initSprite } from "../util/util";
import { getApp, getSceneManager } from "../main";
import audio from "../audio";
import { COLORS } from "../constants";

/**
 * This scene is show each time player wins
 */
export class LifeLostScene extends Scene {
    private background!: Sprite
    private animation: Sprite[] = []
    private time: number = 0
    private lives!: Text;

    constructor() {
        super("life-lost")
        this.init();
    }

    reset(): void {
        this.time = 0;
        audio.play('LOST')
    }

    async init() {
        let spriteURLS = []
        for (let i = 289; i <= 300; i++) {
            spriteURLS.push(i)
        }
        spriteURLS = spriteURLS.map(i => `assets/original/sprite000${i}_32_640x400.png`)

        let animation = await Promise.all(spriteURLS.map(url => initSprite(url)))

        let background = await initSprite(spriteURLS[0])
        this.animation = animation;
        this.background = background;
        background.width = CANVAS_WIDTH
        background.height = CANVAS_HEIGHT
        background.position.set(0, 0)
        this.addChild(background)

        const lives = new Text({
            text: 'LIVES: ',
            style: {
                fill: '#333',
                fontSize: 28,
                fontFamily: 'ARCADECLASSIC',
            },
            anchor: 0.5
        });
        this.addChild(lives)
        lives.position.set(CANVAS_WIDTH * 0.1, CANVAS_HEIGHT * 0.1)
        this.lives = lives;
    }

    update(ticker: Ticker): void {
        getApp().renderer.background.color = COLORS.PURPLE
        this.time += ticker.deltaMS;
        if (this.lives) {
            this.lives.text = `LIVES: ${getSceneManager().getLives()}`
        }
        const animationFrame = Math.ceil(this.time / 120) % this.animation.length
        if (this.background) {
            this.background.texture = this.animation[animationFrame].texture;
        }
        if (animationFrame == this.animation.length - 1) {
            getSceneManager().nextGame()
        }
    }
}