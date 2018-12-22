export class TapeMachine {
    constructor(str) {
        this.recordedMessage = str
    }
    play() {
        console.log(this.recordedMessage)
    }
}