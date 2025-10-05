import * as PIXI from 'pixi.js'

const base = '';

export async function initSprite(path: string): Promise<PIXI.Sprite> {
    const url = base + path
    console.log(`initSprite`, url)
    return new Promise((resolve) => {
        PIXI.Assets.load(url).then(() => {
            resolve(PIXI.Sprite.from(url))
        });
    })
}

export function boundsToRect(bounds: PIXI.Bounds): PIXI.Rectangle {
    return new PIXI.Rectangle(bounds.minX, bounds.minY, bounds.maxX - bounds.minX, bounds.maxY - bounds.minY);
}

export function collides(
    spriteA: PIXI.Sprite,
    spriteB: PIXI.Sprite,
    reduce: number = 1
): boolean {
    let rectA = boundsToRect(spriteA.getBounds())
    let rectB = boundsToRect(spriteB.getBounds())
    rectA.width *= reduce;
    rectA.height *= reduce;
    rectB.width *= reduce;
    rectB.height *= reduce;
    return rectA.intersects(rectB);
}