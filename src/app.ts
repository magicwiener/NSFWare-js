import { Application, Ticker, Assets, Sprite } from "pixi.js";
import controls, { Controls } from "./controls";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./config";
import { SceneManager } from "./sceneManager";



export interface InitResult {
    app: Application,
    sceneManager: SceneManager,
    controls: Controls,
    ticker: Ticker
}

export async function initApp(): Promise<InitResult> {
 
    const app = new Application();
    // create ticker
    const ticker = new Ticker()
    // Initialize the application
    await app.init({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT, background: "#ac56f6" });

    const sceneManager = new SceneManager(app, ticker)

    // Append the application canvas to the document body
    document.getElementById("pixi-container")!.appendChild(app.canvas);



    return {
        app, sceneManager, controls, ticker
    }
}