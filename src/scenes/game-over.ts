import { Sprite, Text, Ticker } from "pixi.js";
import { Scene } from "../scene";
import controls from "../controls";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../config";
import { initSprite } from "../util/util";
import { getApp, getSceneManager } from "../main";
import audio from "../audio";

export class GameOver extends Scene {
    private label!: Text;
    private background!: Sprite
    private animation: Sprite[] = []
    private time: number = 0

    constructor() {
        super("game-over")
        this.init()
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
        spriteURLS = spriteURLS.map(i => `/assets/original/sprite000${i}_32_640x400.png`)

        let animation = await Promise.all(spriteURLS.map(url => initSprite(url)))

        let background = await initSprite(spriteURLS[0])
        this.animation = animation;
        this.background = background;
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
        this.label = myText;
    }

    update(ticker: Ticker): void {
        getApp().renderer.background.color = '#ac56f6'
        this.time += ticker.deltaMS;
        const frameDuration = 120;
        const animationFrame = Math.ceil(this.time / 120) % this.animation.length
        if (this.background && this.time < frameDuration * (this.animation.length - 1)) {
            this.background.texture = this.animation[animationFrame].texture;
        } else {
            this.background.texture = this.animation[this.animation.length - 1].texture;
        }
        this.label.text = `GAME OVER\n SCORE: ${getSceneManager().totalScore}`
        if (controls.state.Enter) {
            window.location.reload();
        }
    }
}