import { Sprite, Text, Texture, Ticker } from "pixi.js"
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../config";
import { getApp, getSceneManager } from "../main";
import { GameConfig, Microgame } from "../microgame";
import { collides, initSprite } from "../util/util";
import controls from "../controls";
import audio from "../audio";

export class Watch extends Microgame {

    private time: number = 0
    private timerText: Text;
    private couple: Sprite
    private player: Sprite
    private animation: Sprite[] = []
    private turning = false; 
    private turnStart: number = 0;
    private spriteURLS: string[] = [];


    constructor() {
        super("watch")
        this.start()
    }

    reset() {
        this.turning = false;
        this.time = 0;
        this.turnStart = 0;
        console.log(`${this.getConfig().gameId}`, this)
        audio.playRandomLoop()
    }

    getConfig(): GameConfig {
        return {
            title: "Watch",
            bgColor: '#6D57F6',
            textColor: '#59C3F9',
            gameId: this.name
        }
    }

    async start() {
        let spriteURLS = []
        for (let i = 283; i <= 288; i++) {
            spriteURLS.push(i)
        }
        spriteURLS = spriteURLS.map(i => `/assets/original/sprite000${i}_32_640x400.png`)
        this.spriteURLS = spriteURLS;
        let animation = await Promise.all(spriteURLS.map(url => initSprite(url)))
        this.animation = animation;
        let player = await initSprite(spriteURLS[2])

        this.player = player;

        player.position.set(0, 0)
        this.addChild(player)
        let couple = await initSprite(spriteURLS[4])

        this.couple = couple;
        couple.position.set(0, 0)
        this.addChild(couple)


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
        if (this.animation?.length) {
            const coupleFrame = Math.trunc(this.time / 150) % 3
            this.couple.texture = this.animation[3 + coupleFrame].texture
            if (this.turning) {
                const elapsed = this.time - this.turnStart;
                const frameDuration = 1000 / 3;
                let frame = 2 - Math.floor(elapsed / frameDuration);
                if (frame < 0) {
                    frame = 0
                }
                this.player.texture = this.animation[frame].texture
            }
        }
    }


    update(ticker: Ticker) {
        getApp().renderer.background.color = '#59C3F9'
        this.animate();
        this.time += ticker.deltaMS;
        const timeSec = Math.trunc(this.time / 1000)
        if (this.timerText) {
            this.timerText.text = (5 - timeSec)
        }
        if (controls.state.ArrowRight) {
            this.turning = true
            this.turnStart = this.time;
        }

        if (timeSec >= 5) {
            getSceneManager().win();
        }
        if (this.turning && this.time - this.turnStart > 1000) {
            controls.state.ArrowRight = false;
            getSceneManager().lose()
        }
    }


}