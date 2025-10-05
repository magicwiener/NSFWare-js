import { Text, HTMLText, Sprite, Ticker } from "pixi.js";
import { Scene } from "../scene";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../config";
import { initSprite } from "../util/util";
import { getSceneManager } from "../main";
import controls from "../controls";

export class IntroScene extends Scene {
    private background!: Sprite
    private animation: Sprite[] = []
    private time: number = 0

    constructor() {
        super("intro")
        this.init();
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
            text: '<red>How to play</red>',
            style: {
                fontFamily: 'Impact',
                fontSize: 48,
                fill: '#ffffff',
                tagStyles: {
                    red: { fill: '#58C1F7' },
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
            text: '1.Use arrow keys\n2.Use on-screen hints\n3.Enjoy!\n\nPressing "Enter" wil start the game..',
            style: {
                fill: '#333',
                fontSize: 28,
                fontFamily: 'Impact',
            },
        });
        this.addChild(hint)
        hint.position.set(CANVAS_WIDTH * 0.03, CANVAS_HEIGHT * 0.2)
    }

    update(ticker: Ticker): void {
        this.time += ticker.deltaMS;
        const animationFrame = Math.ceil(this.time / 500) % 2
        if (this.background) {
            this.background.texture = this.animation[animationFrame].texture;
        }
        if (controls.state.Enter) {
            controls.state.Enter = false;
            getSceneManager().startGameGauntlet()
        }
    }
}