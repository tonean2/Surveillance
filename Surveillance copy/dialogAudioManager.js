class DialogAudioManager {
    constructor() {
        this.typingSound = null;
        this.initialized = false;
    }

    initialize() {
        this.typingSound = new Audio('./audio/typing_3.mp3');
        this.typingSound.volume = 0.5; // Adjust volume as needed
        this.typingSound.loop = true;
        this.initialized = true;
    }

    startTyping() {
        if (!this.initialized) this.initialize();
        this.typingSound.play();
    }

    stopTyping() {
        if (!this.initialized) return;
        this.typingSound.pause();
        this.typingSound.currentTime = 0;
    }
}

export const dialogAudioManager = new DialogAudioManager();