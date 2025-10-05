export class Controls {

    state = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
        Escape: false,
        Enter: false,
        X: false,
        Z: false
    } as { [key: string]: boolean }

    constructor() {
        this.init();
    }

    init() {
        window.addEventListener('keyup', (evt) => this.onKeyUp(evt))
        window.addEventListener('keydown', (evt) => this.onKeyDown(evt))
        const touchCountrols = document.querySelectorAll('.btn')
        if (touchCountrols.length) {
            // add touch 
            touchCountrols.forEach(el => {
                const key = el.attributes.getNamedItem('data-btn')?.value
                el.addEventListener("touchstart", () => this.onKeyDown({ key } as KeyboardEvent));
                el.addEventListener("touchend", () => this.onKeyUp({ key } as KeyboardEvent));
            })
        }
    }

    toggle(key: string, value: boolean = false) {
        if (['x', 'z'].includes(key)) {
            key = key.toUpperCase()
        }
        if (Object.keys(this.state).includes(key)) {
            this.state[key] = value;
        } else {
            console.warn(`Can't toggle ${key}=${value}`)
        }
    }

    onKeyUp(evt: KeyboardEvent) {
        this.toggle(evt.key, false)
    }

    onKeyDown(evt: KeyboardEvent) {
        this.toggle(evt.key, true)
    }

}

export default new Controls()