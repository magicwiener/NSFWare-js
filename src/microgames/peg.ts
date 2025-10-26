import { Sprite, Text, Ticker } from "pixi.js"
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../config";
import { getApp, getSceneManager } from "../main";
import { GameConfig, Microgame } from "../microgame";
import { initSprite } from "../util/util";
import controls from "../controls";
import audio from "../audio";
import { COLORS } from "../constants";

export class Peg extends Microgame {

    private time: number = 0
    private timerText!: Text;
    private player!: Sprite
    private animation: Sprite[] = []
    private pos = 0;
    private seq!: number[];


    constructor() {
        super("peg")
        this.start()
    }

    reset() {
        this.time = 0;
        this.pos = 0;
        this.seq = [];
        audio.playRandomLoop()
    }

    getConfig(): GameConfig {
        return {
            title: "Peg",
            bgColor: COLORS.BLUE,
            textColor: COLORS.PURPLE,
            gameId: this.name
        }
    }

    async start() {
        let spriteURLS = []
        for (let i = 65; i <= 68; i++) {
            spriteURLS.push(`assets/original/sprite0000${i}_32_640x400.png`)
        }

        let animation = await Promise.all(spriteURLS.map(url => initSprite(url)))
        this.animation = animation;
        let player = await initSprite(spriteURLS[0])

        this.player = player;

        player.position.set(0, 0)
        this.addChild(player)

        this.timerText = new Text({
            text: '5',
            style: {
                fill: COLORS.PURPLE,
                fontSize: 64,
                fontFamily: 'ARCADECLASSIC'
            },
            anchor: 0.5
        });
        this.timerText.position.set(CANVAS_WIDTH * 0.1, CANVAS_HEIGHT * 0.9)
        this.addChild(this.timerText)
    }

    animate(): void {
        this.player.texture = this.animation[this.pos].texture
    }


    update(ticker: Ticker) {
        getApp().renderer.background.color = COLORS.BLUE
        this.animate();
        this.time += ticker.deltaMS;
        const timeSec = Math.trunc(this.time / 1000)
        if (this.timerText) {
            this.timerText.text = (5 - timeSec)
        }
        let match = this.seq.join('').match(/0123/g);
        if (match && match.length >= 2) {
            getSceneManager().win();
        } else if (timeSec >= 5) {
            getSceneManager().lose();
        }

        if (controls.state.ArrowLeft === true && this.pos < 4) {
            this.pos = Math.min(this.pos + 1, 3);
            controls.state.ArrowLeft = false;
            this.seq.push(this.pos)
        }

        if (controls.state.ArrowRight === true && this.pos > 0) {
            this.pos -= 1;
            controls.state.ArrowRight = false;
            this.seq.push(this.pos)
        }



    }


}