import { Sprite, Text, Ticker } from "pixi.js"
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../config";
import { getApp, getSceneManager } from "../main";
import { GameConfig, Microgame } from "../microgame";
import { initSprite } from "../util/util";
import controls from "../controls";
import audio from "../audio";


export class Swap extends Microgame {

    private time: number = 0
    private timerText!: Text;
    private player!: Sprite;
    private indicator!: Sprite;
    private animation!: Sprite[];
    private seed: number = 0;
    private indicatorSeed: number = 0;

    constructor() {
        super("swap")
        this.start()
    }

    getConfig(): GameConfig {
        return {
            title: "Swap",
            bgColor: '#6D57F6',
            textColor: '#59C3F9',
            gameId: this.name
        }
    }

    reset() {
        this.time = 0;
        this.seed = Math.trunc(Math.random() * 5)
        this.indicatorSeed = Math.trunc(Math.random() * 5)
        while (this.indicatorSeed === this.seed) {
            this.indicatorSeed = Math.trunc(Math.random() * 5)
        }
        console.log(`${this.getConfig().gameId}`, this)
        audio.playLoop('SWAP')
    }

    animate() {
        const frameDuration = 1000 / 2;
        this.indicator.texture = this.animation[12 + this.indicatorSeed].texture
        let frame = Math.trunc(this.time / frameDuration) % 2 + this.seed * 2;
        this.player.texture = this.animation[frame].texture
    }

    async start() {
        this.reset();
        let spriteURLS = []
        for (let i = 240; i <= 251; i++) {
            spriteURLS.push(i)
        }
        spriteURLS = spriteURLS.map(i => `/assets/original/sprite000${i}_32_640x400.png`)
        for (let i = 252; i <= 256; i++) {
            spriteURLS.push(`/assets/original/sprite000${i}_32_92x48.png`)
        }
        this.animation = await Promise.all(spriteURLS.map(url => initSprite(url)))

        this.player = await initSprite(spriteURLS[this.seed * 2])
        
        this.indicator = await initSprite(`/assets/original/sprite000${252 + this.indicatorSeed}_32_92x48.png`)
        this.indicator.position.set(CANVAS_WIDTH * 0.8, CANVAS_HEIGHT * 0.8)
        this.addChild(this.player)
        this.addChild(this.indicator)

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



    update(ticker: Ticker) {
        getApp().renderer.background.color = '#F7D64E'
        this.time += ticker.deltaMS;
        const timeSec = Math.trunc(this.time / 1000)
        if (this.timerText) {
            this.timerText.text = (5 - timeSec)
        }
        if (timeSec >= 5) {
            if (this.seed === this.indicatorSeed) {
                getSceneManager().win();
            } else {
                console.log(
                    this.getConfig().gameId,
                    this.seed,
                    this.indicatorSeed
                )
                getSceneManager().lose();
            }

        }
        if (controls.state.ArrowRight) {
            this.seed = this.seed === 5 ? 0 : this.seed + 1
            controls.state.ArrowRight = false;
        }
        if (controls.state.ArrowLeft) {
            this.seed = this.seed === 0 ? 5 : this.seed - 1
            controls.state.ArrowLeft = false;
        }
        this.animate();
    }


}