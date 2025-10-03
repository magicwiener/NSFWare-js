import { Container, Ticker } from "pixi.js";

export class Scene extends Container {
  constructor(protected sceneName: String) {
    super();
  }

  get name(): string {
    return this.sceneName
  }

  update(ticker: Ticker): void {
    // noop, override this
  }

  reset(): void {
    
  }

}