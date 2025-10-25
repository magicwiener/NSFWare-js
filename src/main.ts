import { Application, Ticker } from "pixi.js";
import { initApp, InitResult } from "./app";
import { Controls } from "./controls";
import { SceneManager } from "./sceneManager";
import * as PIXI from "pixi.js"

// load font
PIXI.Assets.addBundle('fonts', {
  ARCADECLASSIC: 'assets/ARCADECLASSIC.TTF',
});
PIXI.Assets.loadBundle('fonts')

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
  document.querySelector('#startGame')?.addEventListener('click', async (e) => {
    e.stopPropagation();
    e.preventDefault();
  
    if ((window as any)['isInitializing'] === true) {
      return;
    } else {
      (window as any)['isInitializing'] = true
    }
  
    // 1. hide consent screen
    let consent = document.querySelector('#consent')
    if (consent) {
      consent.parentElement?.removeChild(consent)
    }
    _ = await initApp()
  });
  (document.querySelector('#startGame') as HTMLElement)?.focus();

})();
