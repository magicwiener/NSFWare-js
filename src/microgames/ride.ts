import { Sprite, Text, Texture, Ticker } from "pixi.js"
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../config";
import { getApp, getSceneManager } from "../main";
import { GameConfig, Microgame } from "../microgame";
import { collides, initSprite } from "../util/util";
import controls from "../controls";
import audio from "../audio";

const MIN_TIME_BETWEEN_MS = 200;
export class Ride extends Microgame {

    private lastInputTime: number = 0;
    private timerText: Text;
    private time: number = 0
    private player: Sprite
    private animation: Sprite[] = []
    private counter: number = 0;
    private allMoves: string = ''

    constructor() {
        super("ride")
        this.start()
    }

    reset() {
        this.allMoves = ''
        this.time = 0;
        this.lastInputTime = 0;
        this.counter = 0;
        console.log(`${this.getConfig().gameId}`, this)
        audio.play('RIDE')
    }
    getConfig(): GameConfig {
        return {
            title: "Ride",
            bgColor: '#6D57F6',
            textColor: '#59C3F9',
            gameId: this.name
        }
    }

    async start() {
        let spriteURLS = []
        for (let i = 12; i <= 15; i++) {
            spriteURLS.push(i)
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
        if (this.player && this.animation) {
            this.player.texture = this.animation[this.counter].texture
        }
    }

    update(ticker: Ticker) {
        getApp().renderer.background.color = '#59C3F9'
        this.time += ticker.deltaMS;
        const timeSec = Math.trunc(this.time / 1000)
        if (this.timerText) {
            this.timerText.text = (5 - timeSec)
        }

        if (controls.state.ArrowUp || controls.state.ArrowDown) {
            const timePassed = this.time - this.lastInputTime;

            if (this.lastInputTime === 0 || timePassed > MIN_TIME_BETWEEN_MS) {
                this.lastInputTime = this.time;

                if (controls.state.ArrowUp && this.counter > 0) {
                    this.counter--;
                    this.allMoves += this.counter;
                } else if (controls.state.ArrowDown && this.counter < 2) {
                    this.counter++;
                    this.allMoves += this.counter;
                }
            }
        }
        this.animate();
        if (timeSec >= 5) {
            getSceneManager().lose();
        }

        if (this.allMoves.length) {
            const back = (this.allMoves.match(/012/g) || []).length;
            const forth = (this.allMoves.match(/210/g) || []).length;
            if (back + forth> 4) {
                getSceneManager().win();
            } 
        }
    }


}