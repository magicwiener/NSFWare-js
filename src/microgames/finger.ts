import { Sprite, Text, Ticker } from "pixi.js"
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../config";
import { getApp, getSceneManager } from "../main";
import { GameConfig, Microgame } from "../microgame";
import { initSprite } from "../util/util";
import controls from "../controls";
import audio from "../audio";
import { COLORS } from "../constants";

export class Finger extends Microgame {

    private time: number = 0
    private timerText!: Text;
    private player!: Sprite
    private girl!: Sprite
    private animation: Sprite[] = []
    private rightCounter = 0;


    constructor() {
        super("finger")
        this.start()
    }

    reset() {
        this.time = 0;
        this.rightCounter = 0;
        audio.playRandomLoop()
    }

    getConfig(): GameConfig {
        return {
            title: "Finger",
            bgColor: COLORS.RED,
            textColor: COLORS.DARK_BLUE,
            gameId: this.name
        }
    }

    async start() {
        let spriteURLS = [
            `assets/original/sprite000199_32_320x400.png`,
            `assets/original/sprite000200_32_320x400.png`
        ]
        for (let i = 201; i <= 217; i++) {
            spriteURLS.push(`assets/original/sprite000${i}_32_640x400.png`)
        }

        let animation = await Promise.all(spriteURLS.map(url => initSprite(url)))
        this.animation = animation;
        let player = await initSprite(spriteURLS[0])

        this.player = player;

        player.position.set(CANVAS_WIDTH / 2, 0)
        let girl = await initSprite(spriteURLS[2])
        this.girl = girl;
        girl.position.set(0, 0)
        this.addChild(player)
        this.addChild(girl)

        this.timerText = new Text({
            text: '5',
            style: {
                fill: COLORS.BLUE,
                fontSize: 36,
            },
            anchor: 0.5
        });
        this.timerText.position.set(CANVAS_WIDTH * 0.1, CANVAS_HEIGHT * 0.9)
        this.addChild(this.timerText)
    }

    animate(): void {
        // player is only 0 or 1
        let idx = this.rightCounter % 2
        this.player.texture = this.animation[idx].texture
        // girl
        let girlIdx = Math.min(Math.trunc(this.rightCounter /1.5), this.animation.length-1 -2)
        this.girl.texture = this.animation[2 + girlIdx].texture
    }


    update(ticker: Ticker) {
        getApp().renderer.background.color = COLORS.RED
        this.animate();
        this.time += ticker.deltaMS;
        const timeSec = Math.trunc(this.time / 1000)
        if (this.timerText) {
            this.timerText.text = (5 - timeSec)
        }

        if (this.rightCounter > 24 && timeSec >= 5) {
            getSceneManager().win();
        } else if (timeSec >= 5) {
            getSceneManager().lose();
        }

        if (controls.state.ArrowRight === true) {
            this.rightCounter += 1;
            controls.state.ArrowRight = false;
        }



    }


}