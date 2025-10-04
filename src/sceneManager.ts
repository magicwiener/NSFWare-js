import { Application, Ticker } from "pixi.js";
import { Microgame } from "./microgame";
import { QTE } from "./microgames/qte";
// import { Runner } from "./microgames/sext";
import { Scene } from "./scene";
import { StartScene } from "./scenes/start";
import { IntroScene } from "./scenes/intro";
import { YouHaveLostScene } from "./scenes/lost";
import { YouHaveWonScene } from "./scenes/won";
import { Catch } from "./microgames/catch";
import { EndingScene } from "./scenes/ending";
import { LoadingScene } from "./scenes/loading";
import { Sext } from "./microgames/sext";
import { LifeLostScene } from "./scenes/life-lost";
import { Ride } from "./microgames/ride";
import { Watch } from "./microgames/watch";
import { GameName } from "./scenes/game-name";



const GAUNTLET_ORDER = [
    "watch", "sext", "ride",
];

export class SceneManager {
    private scenes: Scene[] = [];
    private games: Microgame[] = [];
    private activeScene?: Scene
    private lives = 3;
    private gameOrder: string[] = [...GAUNTLET_ORDER]

    constructor(
        private app: Application,
        private ticker: Ticker
    ) {
        // games
        this.games.push(new Watch())
        this.games.push(new Sext())
        this.games.push(new Ride())


        // other screens
        this.scenes.push(new StartScene())
        this.scenes.push(new YouHaveLostScene())
        this.scenes.push(new YouHaveWonScene())
        this.scenes.push(new IntroScene())
        this.scenes.push(new EndingScene())
        this.scenes.push(new LoadingScene())
        this.scenes.push(new LifeLostScene())

        ticker.add((t) => this.update(t))

        this.setScene('ride')
        // this.startGame('start')
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
        this.app.stage.removeChild(this.activeScene)
;
        this.activeScene = newScene
        this.app.stage.addChild(newScene)
        this.ticker.start();
    }

    startGame(gameName: string) {
        let game = this.games.find(it => it.name === gameName)
        if (!game) {
            throw new Error(`Cant find game=${gameName}`)
        }
        this.app.stage.removeChild(this.activeScene)
        this.ticker.stop()

        const config = game.getConfig()

        this.activeScene = new GameName(config)
        this.app.stage.addChild(this.activeScene)

        this.ticker.start()
    }

    startGameGauntlet(): void {
        // Game gauntlet in the first iteration is just 3 games
        // no dynamic difficulty
        // no score
        this.nextGame();
    }

    nextGame(): void {
        const nextGame = this.gameOrder.shift()
        if (nextGame) {
            this.startGame(nextGame!)
        } else {
            this.setScene('ending')
        }

    }

    update(t: Ticker) {
        this.activeScene?.update(t)
    }

    getLives(): number {
        return this.lives;
    }

    win() {
        if (this.gameOrder.length > 0) {
            this.setScene('loading')
        } else {
            this.setScene('ending')
        }
        this.activeScene?.reset();
    }

    lose() {
        this.lives -= 1;
        if (this.lives > 0) {
            this.setScene('life-lost')
        } else {
            this.setScene('game-over')
        }
        this.activeScene?.reset();
    }

}
