import { Application, Ticker } from "pixi.js";
import { Microgame } from "./microgame";

import { Scene } from "./scene";
import { StartScene } from "./scenes/start";
import { IntroScene } from "./scenes/intro";
import { GameOver } from "./scenes/game-over";
import { YouHaveWonScene } from "./scenes/won";

import { LoadingScene } from "./scenes/loading";
import { Sext } from "./microgames/sext";
import { LifeLostScene } from "./scenes/life-lost";
import { Ride } from "./microgames/ride";
import { Watch } from "./microgames/watch";
import { GameName } from "./scenes/game-name";
import { Swap } from "./microgames/swap";
import { Hold } from "./microgames/hold";
import { Spank } from "./microgames/spank";
import {arrayToShuffled } from 'array-shuffle';
import audio from "./audio";
import { Gag } from "./microgames/gag";
import { Finger } from "./microgames/finger";


const GAMES_AVAILABLE = [
    "watch", "sext", "ride", "swap", "hold", "spank"
];

export class SceneManager {
    private scenes: Scene[] = [];
    private games: Microgame[] = [];
    private activeScene?: Scene
    private lives = 3;
    private score = 0

    private gameOrder: string[] = []

    constructor(
        private app: Application,
        private ticker: Ticker
    ) {
        // games
        this.games.push(new Watch())
        this.games.push(new Sext())
        this.games.push(new Ride())
        this.games.push(new Swap())
        this.games.push(new Hold())
        this.games.push(new Spank())
        this.games.push(new Gag())
        this.games.push(new Finger())


        // other screens
        this.scenes.push(new StartScene())
        this.scenes.push(new GameOver())
        this.scenes.push(new YouHaveWonScene())
        this.scenes.push(new IntroScene())
        this.scenes.push(new LoadingScene())
        this.scenes.push(new LifeLostScene())

        ticker.add((t) => this.update(t))

        this.startGame('finger')
        // this.setScene('start')
    }

    setScene(name: string) {
        this.ticker.stop()
        let newScene = [
            ...this.scenes,
            ...this.games,
        ].find(it => it.name === name)
        
        if (!newScene) {
            throw new Error(`Cant find scene=${name}`)
        }
        this.app.stage.removeChild(this.activeScene!)
;
        this.activeScene = newScene
        this.app.stage.addChild(newScene)
        newScene.reset()
        this.ticker.start();
    }

    startGame(gameName: string) {
        let game = this.games.find(it => it.name === gameName)
        if (!game) {
            throw new Error(`Cant find game=${gameName}`)
        }
        this.app.stage.removeChild(this.activeScene!)
        this.ticker.stop()

        const config = game.getConfig()

        this.activeScene = new GameName(config)
        this.app.stage.addChild(this.activeScene)
        audio.stopLoops();
        this.activeScene.reset()

        this.ticker.start()
    }

    startGameGauntlet(): void {
        this.score = 0;
        this.gameOrder = arrayToShuffled(GAMES_AVAILABLE)
        this.nextGame();
    }

    nextGame(): void {
        const nextGame = this.gameOrder.shift()
        if (nextGame) {
            this.startGame(nextGame!)
        } else {
            this.gameOrder = arrayToShuffled(GAMES_AVAILABLE)
            this.nextGame()
        }

    }

    update(t: Ticker) {
        this.activeScene?.update(t)
    }

    getLives(): number {
        return this.lives;
    }

    win() {
        this.score+=1;
        audio.stopLoops();
        this.setScene('loading')
        this.activeScene?.reset();
    }

    lose() {
        audio.stopLoops();
        this.lives -= 1;
        if (this.lives > 0) {
            this.setScene('life-lost')
        } else {
            this.setScene('game-over')
        }
        this.activeScene?.reset();
    }

    get totalScore(): number {
        return this.score;
    }
}
