import { Sprite, Text, Ticker } from "pixi.js"
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../config";
import { getApp, getSceneManager } from "../main";
import { GameConfig, Microgame } from "../microgame";
import { initSprite } from "../util/util";
import controls from "../controls";
import { COLORS } from "../constants";

export class Strip extends Microgame {

    private timerText!: Text;
    private time: number = 0
    private player!: Sprite
    private animation: Sprite[] = []
    private counter: number = 0;
    private lastCounterPos: number = 0;
    private undressTime: number = 0;
    private undressing: boolean = false;


    constructor() {
        super("strip")
        this.start()
    }

    reset() {
        this.time = 0;
        this.counter = 0;
        this.lastCounterPos = 0;
        this.undressTime = 0;
        this.undressing = false;
    }

    getConfig(): GameConfig {
        return {
            title: "Strip",
            bgColor: COLORS.BLUE,
            textColor: COLORS.YELLOW,
            gameId: this.name
        }
    }

    async start() {
        let spriteURLS = []
        for (let i = 222; i <= 237; i++) {
            spriteURLS.push(i)
        }
        spriteURLS = spriteURLS.map(i => `assets/original/sprite000${i}_32_640x400.png`)

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
        this.timerText.position.set(CANVAS_WIDTH * 0.1, CANVAS_HEIGHT * 0.85)
        this.addChild(this.timerText)
    }


    animate(): void {
        if (!this.player && !this.animation) {
            return;
        }
        const frameDuration = 1000 / 4;
        const totalFrames = this.animation.length;
        const direction = this.undressing ? 'down' : 'up'

        if (direction === 'down') {
            const nextFrame = this.lastCounterPos + Math.trunc((this.time - this.undressTime) / frameDuration) % totalFrames
            this.counter = Math.min(nextFrame, this.animation.length);
        } else if (this.counter > 0) {
            const nextFrame = this.lastCounterPos - Math.trunc((this.time - this.undressTime) / frameDuration);
            this.counter = Math.max(nextFrame, 0)
        }
        this.player.texture = this.animation[this.counter].texture
    }

    update(ticker: Ticker) {
        getApp().renderer.background.color = COLORS.BLUE
        this.time += ticker.deltaMS;
        const timeSec = Math.trunc(this.time / 1000)
        if (this.timerText) {
            this.timerText.text = this.counter//(5 - timeSec)
        }
        if (controls.state.ArrowDown && !this.undressing) {
            this.undressing = true;
            this.undressTime = this.time;
            this.lastCounterPos = this.counter;
        } else if (controls.state.ArrowDown === false && this.undressing) {
            this.undressing = false;
            this.undressTime = this.time;
            this.lastCounterPos = this.counter
        }

        this.animate();
        if (this.counter === 15) {
            getSceneManager().win()
        }
        if (timeSec >= 5) {
            getSceneManager().lose();
        }

    }


}