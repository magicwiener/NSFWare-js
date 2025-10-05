import { Howl } from 'howler';

const SOUNDS: { [key: string]: string } = {
    LOADING: 'au000021',
    CAMERA_CLICK: 'au000023',
    LOST: 'au000003',
    SLAP: 'au000022',
}

const LOOPS: { [key: string]: string } = {
    MENU: 'au000016',
    RIDE: 'au000014',
    SWAP: 'au000008',
    LOOP_1: 'au000006',
    LOOP_2: 'au000005',
    LOOP_3: 'au000007',
    LOOP_4: 'au000008',
    LOOP_5: 'au000009',
}

export class Audio {

    private sounds: { [key: string]: Howl } = {};
    private loops: { [key: string]: Howl } = {};

    init(): void {
        Object.keys(SOUNDS).map(
            key => {
                const name = SOUNDS[key]
                const url = `/assets/audio/${name}.wav`
                this.sounds[key] = new Howl({
                    src: [url]
                });

            }
        )

        Object.keys(LOOPS).map(
            key => {
                const name = LOOPS[key]
                const url = `/assets/audio/${name}.wav`
                this.loops[key] = new Howl({
                    src: [url],
                    loop: true
                });

            }
        )
    }

    play(id: string): void {
        let howl = this.sounds[id]
        if (!howl) {
            console.warn(`cant find sound=${id}`)
        } else {
            howl.play()
        }
    }

    playLoop(id: string): void {
        this.stopLoops()
        let howl = this.loops[id]
        if (!howl) {
            console.warn(`cant find loop=${id}`)
        } else {
            howl.play()
        }
    }

    playRandomLoop(): void {
        // never play menu music (1+)
        const idx = 1 + Math.trunc(Math.random() * Object.keys(this.loops).length - 1)
        this.playLoop(Object.keys(this.loops)[idx])
    }

    stopLoops(): void {
        Object.keys(this.loops).forEach(loopName => this.loops[loopName].stop())
    }
}

export default new Audio();