class AudioManager {
    constructor() {
        this.backgroundMusic = new Audio('./audio/background_music2.mp3');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.5;
        this.isMuted = false;
        this.playAttempted = false;
    }

    initialize() {
        // Try to play immediately
        this.attemptAutoplay();

        // Backup event listeners for browsers that block autoplay
        const playEvents = ['click', 'touchstart', 'keydown'];
        
        const handleUserInteraction = () => {
            if (!this.playAttempted) {
                this.playBackgroundMusic();
                this.playAttempted = true;
                // Remove all event listeners once played
                playEvents.forEach(event => {
                    document.removeEventListener(event, handleUserInteraction);
                });
            }
        };

        // Add multiple event listeners for better interaction coverage
        playEvents.forEach(event => {
            document.addEventListener(event, handleUserInteraction);
        });

        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseBackgroundMusic();
            } else if (!this.isMuted) {
                this.resumeBackgroundMusic();
            }
        });
    }

    async attemptAutoplay() {
        try {
            // Try to play immediately
            await this.backgroundMusic.play();
            this.playAttempted = true;
            console.log('Autoplay successful');
        } catch (error) {
            console.log('Autoplay failed, waiting for user interaction:', error);
        }
    }

    playBackgroundMusic() {
        if (!this.isMuted) {
            // Use Promise-based play with retry logic
            const playPromise = this.backgroundMusic.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn('Playback failed:', error);
                    // If playback fails, retry once after a short delay
                    setTimeout(() => {
                        this.backgroundMusic.play().catch(error => {
                            console.warn('Retry playback failed:', error);
                        });
                    }, 1000);
                });
            }
        }
    }

    handleDialog(isDialogActive) {
        if (isDialogActive) {
            this.playBackgroundMusic();
        } else {
            this.pauseBackgroundMusic();
        }
    }

    pauseBackgroundMusic() {
        this.backgroundMusic.pause();
    }

    resumeBackgroundMusic() {
        if (!this.isMuted && this.playAttempted) {
            this.playBackgroundMusic();
        }
    }

    setVolume(volume) {
        this.backgroundMusic.volume = Math.max(0, Math.min(1, volume));
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.pauseBackgroundMusic();
        } else {
            this.resumeBackgroundMusic();
        }
    }

    handlePauseState(isPaused) {
        if (isPaused) {
            this.pauseBackgroundMusic();
        } else {
            this.resumeBackgroundMusic();
        }
    }
}

export default AudioManager;