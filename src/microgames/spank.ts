import { Sprite, Text, Texture, Ticker } from "pixi.js"
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../config";
import { getApp, getSceneManager } from "../main";
import { GameConfig, Microgame } from "../microgame";
import { collides, initSprite } from "../util/util";
import controls from "../controls";

export class Spank extends Microgame {

    private time: number = 0
    private spankTime: number = 0
    private timerText: Text;
    private player: Sprite
    private animation: Sprite[] = []
    private spanking = false;
    private spanks: number = 0;


    constructor() {
        super("spank")
        this.start()
    }

    reset() {
        this.time = 0;
        this.spanking = false;
        this.spanks = 0;
        this.spankTime = 0
    }

    getConfig(): GameConfig {
        return {
            title: "Spank",
            bgColor: '#6D57F6',
            textColor: '#59C3F9',
            gameId: this.name
        }
    }

    async start() {
        let spriteURLS = []
        for (let i = 7; i <= 11; i++) {
            spriteURLS.push(`${i}`.length === 1 ? '0' + i : i)
        }
        spriteURLS = spriteURLS.map(i => `/assets/original/sprite0000${i}_32_640x400.png`)

        let animation = await Promise.all(spriteURLS.map(url => initSprite(url)))
        this.animation = animation;
        let player = await initSprite(spriteURLS[0])

        this.player = player;

        player.position.set(0, 0)
        this.addChild(player)

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

    animate(): void {
        if (!this.animation?.length) {
            return;
        }
        if (!this.spanking) {
            this.player.texture = this.animation[0].texture
        } else {
            const frameDuration = 1000 / 3;
            let frame = 1 + Math.trunc((this.time - this.spankTime) / frameDuration) % 4;
            this.player.texture = this.animation[frame].texture
            if (frame === 4) {
                this.spanks += 1;
                this.spanking = false;
                controls.state.ArrowRight = false;
                this.spankTime = 0
            }
        }

    }


    update(ticker: Ticker) {
        getApp().renderer.background.color = '#6c57f6'
        this.animate();
        this.time += ticker.deltaMS;
        const timeSec = Math.trunc(this.time / 1000)
        if (this.timerText) {
            this.timerText.text = (5 - timeSec)
        }
        if (controls.state.ArrowRight && !this.spanking) {
            this.spanking = true;
            this.spankTime = this.time;
        }

        if (timeSec >= 5) {
            if (this.spanks > 2) {
                getSceneManager().win()
            } else {
                getSceneManager().lose();
            }
        }
    }

}