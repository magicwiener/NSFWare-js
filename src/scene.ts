import { Container, Ticker } from "pixi.js";

export class Scene extends Container {
  constructor(protected sceneName: string) {
    super();
  }

  get name(): string {
    return this.sceneName
  }

  update(_: Ticker): void {
    // noop, override this
  }

  reset(): void {
    
  }

}