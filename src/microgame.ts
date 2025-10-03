import { Scene } from "./scene";


export interface GameConfig {
    title: string,
    bgColor: string,
    textColor: string,
    gameId: string;
}

export class Microgame extends Scene {
    constructor(name: string) {
        super(name)
    }

    getConfig(): GameConfig {
        throw new Error('not implemented')
    }
}