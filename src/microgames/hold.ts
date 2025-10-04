import { Sprite, Text, Texture, Ticker } from "pixi.js"
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../config";
import { getApp, getSceneManager } from "../main";
import { GameConfig, Microgame } from "../microgame";
import { collides, initSprite } from "../util/util";
import controls from "../controls";

export class Hold extends Microgame {

    private time: number = 0
    private timerText: Text;
    private player: Sprite
    private animation: Sprite[] = []
    private holding = false;
    private holdingTime = 0;


    constructor() {
        super("hold")
        this.start()
    }

    reset() {
        this.time = 0;
        this.holding= false;
        this.holdingTime = 0;
    }

    getConfig(): GameConfig {
        return {
            title: "Hold",
            bgColor: '#6D57F6',
            textColor: '#59C3F9',
            gameId: this.name
        }
    }

    async start() {
        let spriteURLS = []
        for (let i = 69; i <= 77; i++) {
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
        if (this.holding) {
            this.player.texture = this.animation[1].texture
        } else if (this.time > 3000 && !this.holding) {
            // play fail state
            const frameDuration = 1000 / 3;
            let frame = 2 + Math.trunc(this.time / frameDuration) % 5;
            this.player.texture = this.animation[frame].texture

        }
        else if (this.animation?.length) {
            const frameDuration = 1000 / 5;
            let frame = Math.trunc(this.time / frameDuration) % 2;
            this.player.texture = this.animation[frame].texture
        }

    }


    update(ticker: Ticker) {
        getApp().renderer.background.color = '#EB4F99'
        this.animate();
        this.time += ticker.deltaMS;
        const timeSec = Math.trunc(this.time / 1000)
        if (this.timerText) {
            this.timerText.text = (5 - timeSec)
        }
        if (controls.state.ArrowRight && !this.holding) {
            this.holding = true;
            this.holdingTime = this.time;
        }
        
        if (this.holding && this.time - this.holdingTime > 1000) {
            controls.state.ArrowRight = false;
            getSceneManager().win()
        }

        if (timeSec >= 5) {
            getSceneManager().lose();
        }
        
    }


}