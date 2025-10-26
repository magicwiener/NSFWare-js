import { Sprite, Text, Ticker } from "pixi.js"
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../config";
import { getApp, getSceneManager } from "../main";
import { GameConfig, Microgame } from "../microgame";
import { initSprite } from "../util/util";
import controls from "../controls";
import audio from "../audio";
import { COLORS } from "../constants";

export class Gag extends Microgame {

    private time: number = 0
    private timerText!: Text;
    private player!: Sprite
    private animation: Sprite[] = []
    private downCounter = 0;


    constructor() {
        super("gag")
        this.start()
    }

    reset() {
        this.time = 0;
        this.downCounter = 0;
        audio.playRandomLoop()
    }

    getConfig(): GameConfig {
        return {
            title: "Gag",
            bgColor: COLORS.DARK_BLUE,
            textColor: COLORS.BLUE,
            gameId: this.name
        }
    }

    async start() {
        let spriteURLS = []
        for (let i = 1; i <= 6; i++) {
            spriteURLS.push(i)
        }
        spriteURLS = spriteURLS.map(i => `assets/original/sprite00000${i}_32_640x400.png`)

        let animation = await Promise.all(spriteURLS.map(url => initSprite(url)))
        this.animation = animation;
        let player = await initSprite(spriteURLS[0])

        this.player = player;

        player.position.set(0, 0)
        this.addChild(player)

        this.timerText = new Text({
            text: '5',
            style: {
                fill: COLORS.BLUE,
                fontSize: 64,
                fontFamily: 'ARCADECLASSIC'
            },
            anchor: 0.5
        });
        this.timerText.position.set(CANVAS_WIDTH * 0.1, CANVAS_HEIGHT * 0.9)
        this.addChild(this.timerText)
    }

    animate(): void {
        let idx = Math.trunc(this.downCounter / 2) || 0;
        if (idx > 5) {
           const trigger = 12; // idx crosses 5
           const loopIndex = (this.downCounter - trigger) % 3;
            idx = 4 + (loopIndex + 3) % 3 - 1;
        }

        this.player.texture = this.animation[idx].texture
    }


    update(ticker: Ticker) {
        getApp().renderer.background.color = COLORS.PURPLE
        this.animate();
        this.time += ticker.deltaMS;
        const timeSec = Math.trunc(this.time / 1000)
        if (this.timerText) {
            this.timerText.text = (5 - timeSec)
        }
        
        if (this.downCounter > 20 && timeSec >= 5) {
            getSceneManager().win();
        } else if (timeSec >= 5) {
            getSceneManager().lose();
        }

        if (controls.state.ArrowDown === true) {
            this.downCounter += 1;
            controls.state.ArrowDown = false;
        }

       
        
    }


}