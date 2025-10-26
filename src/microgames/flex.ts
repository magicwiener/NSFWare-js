import { Sprite, Text, Ticker } from "pixi.js"
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../config";
import { getApp, getSceneManager } from "../main";
import { GameConfig, Microgame } from "../microgame";
import { initSprite } from "../util/util";
import controls from "../controls";
import audio from "../audio";
import { COLORS } from "../constants";
import { arrayToShuffled } from "array-shuffle";

export class Flex extends Microgame {

    private time: number = 0
    private timerText!: Text;
    private player!: Sprite
    private animation: Sprite[] = []
    private keySequence = ''
    private keys: Sprite[] = [];


    constructor() {
        super("flex")
        this.start()
    }

    reset() {
        this.time = 0;
        this.keySequence = arrayToShuffled([1, 2, 3, 4]).join('')
        audio.playRandomLoop();
        this.renderSequence();
    }

    getConfig(): GameConfig {
        return {
            title: "Flex",
            bgColor: COLORS.DARK_BLUE,
            textColor: COLORS.BLUE,
            gameId: this.name
        }
    }

    async start() {
        let spriteURLS = []
        // animations
        for (let i = 106; i <= 110; i++) {
            spriteURLS.push(`assets/original/sprite000${i}_32_640x400.png`)
        }
        //icons
        for (let i = 112; i <= 115; i++) {
            spriteURLS.push(`assets/original/sprite000${i}_32_60x61.png`)
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
                fill: COLORS.BLUE,
                fontSize: 64,
                fontFamily: 'ARCADECLASSIC'
            },
            anchor: 0.5
        });
        this.timerText.position.set(CANVAS_WIDTH * 0.1, CANVAS_HEIGHT * 0.9)
        this.addChild(this.timerText)

    }

    async renderSequence(): Promise<void> {
        this.keys.forEach(k => {this.removeChild(k)})
        // draw sequence 
        this.keys = [];
        this.keySequence.split('').forEach(async (el, idx) => {
            // 1 - up, 2 - right, 3 - down, 4 - left
            let sprite = await initSprite(`assets/original/sprite000${111 + parseInt(el)}_32_60x61.png`);
            sprite.position.set(CANVAS_WIDTH * 0.85, CANVAS_HEIGHT * 0.1 + idx * 80)
            this.addChild(sprite)
            this.keys.push(sprite)
        })

    }

    checkKey(key: number): void {
        let next = Number(this.keySequence.split('')[0])
        if (next !== key) {
            getSceneManager().lose()
        } else {
            if (this.keySequence.length === 1) {
                getSceneManager().win()
            } else {
                this.keySequence = this.keySequence.substring(1)
                let icon = this.keys.shift()
                this.removeChild(icon as Sprite)
            }
            
        }
    }

    animate(): void {
        let next = Number(this.keySequence.split('')[0])
        this.player.texture = this.animation[next-1].texture
    }


    update(ticker: Ticker) {
        getApp().renderer.background.color = COLORS.PURPLE
        this.animate();
        this.time += ticker.deltaMS;
        const timeSec = Math.trunc(this.time / 1000)
        if (this.timerText) {
            this.timerText.text = (5 - timeSec)
        }

        if (timeSec >= 5) {
            getSceneManager().lose();
        }

        if (controls.state.ArrowDown === true) {
            this.checkKey(3)
            controls.state.ArrowDown = false;
        }
        if (controls.state.ArrowLeft === true) {
             this.checkKey(4)
            controls.state.ArrowLeft = false;
        }
        if (controls.state.ArrowRight === true) {
             this.checkKey(2)
            controls.state.ArrowRight = false;
        }
        if (controls.state.ArrowUp === true) {
             this.checkKey(1)
            controls.state.ArrowUp = false;
        }



    }


}