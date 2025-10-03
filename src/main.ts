import { Application } from "../node_modules/pixi.js/lib/app/Application";
import { Ticker } from "../node_modules/pixi.js/lib/ticker/Ticker";
import { initApp, InitResult } from "./app";
import { Controls } from "./controls";
import { SceneManager } from "./sceneManager";

let _: InitResult

export function getApp(): Application {
  if (!_.app) {
    throw new Error('App is not initialized')
  } else {
    return _.app;
  }
}

export function getSceneManager(): SceneManager {
  return _.sceneManager;
}

export function getControls(): Controls {
  return _.controls;
}

export function getTicker(): Ticker {
  return _.ticker;
}

(async () => {
  // Create a new application
  _ = await initApp()
})();
