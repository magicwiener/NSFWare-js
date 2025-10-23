import { Text, HTMLText, Ticker, Sprite } from "pixi.js";
import { Scene } from "../scene";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../config";
import { initSprite } from "../util/util";
import controls from "../controls";
import { getApp, getSceneManager } from "../main";
import audio from "../audio";
import { COLORS } from "../constants";

export class StartScene extends Scene {
    private background!: Sprite
    private animation: Sprite[] = []
    private time: number = 0

    constructor() {
        super("start")
        this.init();
    }

    reset(): void {
        this.time = 0;
        audio.playLoop('MENU')
    }

    async init() {
        let animation = await Promise.all([
            initSprite('assets/original/sprite000335_32_640x400.png'),
            initSprite('assets/original/sprite000336_32_640x400.png')
        ])
        
        let background = await initSprite('assets/original/sprite000335_32_640x400.png')
        this.animation = animation;
        this.background = background;
        background.width = CANVAS_WIDTH
        background.height = CANVAS_HEIGHT
        background.position.set(0, 0)
        this.addChild(background)
        const logo = new HTMLText({
            text: '<red>NSFWare-js</red>',
            style: {
                fontFamily: 'Impact',
                fontSize: 48,
                fill: '#ffffff',
                tagStyles: {
                    red: { fill: 'red' },
                },
            },
        });
        logo.position.y = CANVAS_HEIGHT * 0.1
        logo.position.x = CANVAS_WIDTH * 0.2
        logo.anchor = 0.5
        this.addChild(logo)

        const version = new Text({
            text: 'version 0.1',
            style: {
                fill: '#333',
                fontSize: 28,
                fontFamily: 'Impact',
            },
            anchor: 0.5
        });
        version.position.set(CANVAS_WIDTH * 0.84, CANVAS_HEIGHT * 0.9)
        this.addChild(version)

        const hint = new Text({
            text: 'Press "Enter" to start',
            style: {
                fill: '#333',
                fontSize: 28,
                fontFamily: 'Impact',
            },
            anchor: 0.5
        });
        this.addChild(hint)
        hint.position.set(CANVAS_WIDTH * 0.21, CANVAS_HEIGHT * 0.22)
    }

    update(ticker: Ticker): void {
        getApp().renderer.background.color = COLORS.PURPLE
        this.time += ticker.deltaMS;
        const animationFrame = Math.ceil(this.time / 500) % 2
        if (this.background) {
            this.background.texture = this.animation[animationFrame].texture;
        }
        // Update logic here
        if (controls.state.Enter) {
             controls.state.Enter = false;
             getSceneManager().startGameGauntlet()
         }
    }
}