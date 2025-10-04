import * as PIXI from 'pixi.js'

export async function initSprite(path: string): Promise<PIXI.Sprite> {
    return new Promise((resolve, reject) => {
        PIXI.Assets.load(path).then(() => {
            resolve(PIXI.Sprite.from(path))
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