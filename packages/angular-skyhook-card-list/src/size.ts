export class Size {
    constructor(public width: number, public height: number) {}
    style() {
        return {
            width: this.width + "px",
            height: this.height + "px"
        };
    }
}
