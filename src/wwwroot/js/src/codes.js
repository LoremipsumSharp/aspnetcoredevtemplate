export class TapeMachine {
    constructor(str) {
        this.recordedMessage = str
    }
    record(message) {
        this.recordedMessage = message
    }
    play() {
        console.log(this.recordedMessage)
    }
}