import { Sprite, Text, Ticker } from "pixi.js"
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../config";
import { getApp, getSceneManager } from "../main";
import { GameConfig, Microgame } from "../microgame";
import { initSprite } from "../util/util";
import controls from "../controls";
import audio from "../audio";

const SCROLL_SPEED = 200;
const PERFECT_X = -7
const PERFECT_Y = -60
const TOLERANCE = 20

export class Sext extends Microgame {

    private time: number = 0
    private timerText!: Text;
    private handIdle!: Sprite
    private handClick!: Sprite
    private photo!: Sprite
    private isClicking = false;
    private clickTime = 0;

    constructor() {
        super("sext")
        this.start()
    }

    getConfig(): GameConfig {
        return {
            title: "Sext",
            bgColor: '#6D57F6',
            textColor: '#59C3F9',
            gameId: this.name
        }
    }

    reset() {
        this.time = 0;
        this.isClicking = false
        this.clickTime = 0;
        if (this.photo) {
            this.photo.position.set(-CANVAS_WIDTH / 3, -CANVAS_HEIGHT / 3)
        }
        console.log(`${this.getConfig().gameId}`, this)
        audio.playRandomLoop()
    }

    animate() {
        if (this.isClicking) {
            this.handIdle.texture = this.handClick.texture;
        }
    }

    async start() {
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
        this.handIdle = await initSprite("assets/original/sprite000279_32_640x400.png")
        this.handClick = await initSprite("assets/original/sprite000280_32_640x400.png")
        this.photo = await initSprite("assets/original/sprite000281_32_640x640.png")
        this.photo.position.set(-CANVAS_WIDTH / 3, -CANVAS_HEIGHT / 3)
        this.addChild(this.photo)
        this.addChild(this.handIdle)
    }



    update(ticker: Ticker) {
        getApp().renderer.background.color = '#EB4F99'
        this.time += ticker.deltaMS;
        const timeSec = Math.trunc(this.time / 1000)
        if (this.timerText) {
            this.timerText.text = (5 - timeSec)
        }
        if (timeSec >= 5) {
            getSceneManager().lose();
        }
        if (controls.state.ArrowDown && this.photo.position.y > -(CANVAS_HEIGHT * 0.6)) {
            this.photo.position.y -= SCROLL_SPEED * (ticker.deltaMS / 1000);
        }

        if (controls.state.ArrowUp && this.photo.position.y < (CANVAS_HEIGHT * 0.23)) {
            this.photo.position.y += SCROLL_SPEED * (ticker.deltaMS / 1000);
        }

        if (controls.state.ArrowLeft && this.photo.position.x < CANVAS_WIDTH * 0.4) {
            this.photo.position.x += SCROLL_SPEED * (ticker.deltaMS / 1000);
        }

        if (controls.state.ArrowRight && this.photo.position.x > -(CANVAS_WIDTH * 0.4)) {
            this.photo.position.x -= SCROLL_SPEED * (ticker.deltaMS / 1000);
        }

        if (!this.isClicking && Math.abs(this.photo.position.x - PERFECT_X) <= TOLERANCE && Math.abs(this.photo.position.y - PERFECT_Y) <= TOLERANCE) {
            this.isClicking = true;
            this.clickTime = this.time;
            audio.play('CAMERA_CLICK')
        }

        if (this.isClicking && (Math.abs(this.time - this.clickTime) > 500)) {
            getSceneManager().win();
        }

        this.animate();

    }


}