import { Sprite, Text, Ticker } from "pixi.js"
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../config";
import { getApp } from "../main";
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
    private undressTime: number = 0;
    private undressing: boolean = false;


    constructor() {
        super("strip")
        this.start()
    }

    reset() {
        this.time = 0;
        this.counter = 0;
        this.undressTime = 0;
        this.undressing = false;
        console.log(`${this.getConfig().gameId}`, this)
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
                fontSize: 36,
            },
            anchor: 0.5
        });
        this.timerText.position.set(CANVAS_WIDTH * 0.1, CANVAS_HEIGHT * 0.9)
        this.addChild(this.timerText)
    }


    animate(): void {
        if (!this.player && !this.animation) {
            return;
        }
        const frameDuration = 1000 / 2;
        const totalFrames = this.animation.length;
        if (this.undressing) {
            this.counter = 1 + Math.trunc((this.time - this.undressTime) / frameDuration) % (totalFrames - 1);
            if (this.counter >= totalFrames) {
                this.counter = totalFrames - 1
            }
        } else if (this.counter > 0) {
            // go back
            console.log('back ', (this.time - this.undressTime), Math.trunc((this.time - this.undressTime) / frameDuration ))
            this.counter = this.counter - Math.trunc((this.time - this.undressTime) / frameDuration);
            if (this.counter <= 0) {
                this.counter = 0;
            }
        }
        this.player.texture = this.animation[this.counter].texture
    }

    update(ticker: Ticker) {
        getApp().renderer.background.color = COLORS.BLUE
        this.time += ticker.deltaMS;
        const timeSec = Math.trunc(this.time / 1000)
        if (this.timerText) {
            this.timerText.text = this.undressing //(5 - timeSec)
        }
        if (controls.state.ArrowDown && !this.undressing) {
            this.undressing = true;
            this.undressTime = this.time;
        } else if (controls.state.ArrowDown === false && this.undressing) {
            this.undressing = false;
            this.undressTime = this.time;
        }

        this.animate();
        if (timeSec >= 5) {
            // getSceneManager().lose();
        }

    }


}