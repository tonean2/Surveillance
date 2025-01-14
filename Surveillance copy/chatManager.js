// dialogManager.js

class DialogManager {
    constructor() {
        this.dialogQueue = [];
        this.isDisplaying = false;
        this.dialogElement = null;
        this.currentCallback = null;
    }

    initialize() {
        // Create dialog element
        this.dialogElement = document.createElement('div');
        this.dialogElement.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #c2c3b2;
            font-family: 'PixelOperatorMono';
            font-size: 2rem;
            z-index: 1000;
            text-align: center;
            pointer-events: none;
            opacity: 0;
            filter: blur(0.2px);
            text-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
        `;
        document.body.appendChild(this.dialogElement);
    }

    async showDialog(text, duration = 2000) {
        return new Promise((resolve) => {
            this.dialogQueue.push({
                text,
                duration,
                callback: resolve
            });
            
            if (!this.isDisplaying) {
                this.displayNext();
            }
        });
    }

    async displayNext() {
        if (this.dialogQueue.length === 0) {
            this.isDisplaying = false;
            return;
        }

        this.isDisplaying = true;
        const { text, duration, callback } = this.dialogQueue.shift();
        this.currentCallback = callback;

        // Reset the element
        this.dialogElement.style.opacity = '0';
        this.dialogElement.style.transition = 'opacity 0.5s ease';
        this.dialogElement.textContent = '';

        // Fade in
        await new Promise(resolve => requestAnimationFrame(resolve));
        this.dialogElement.style.opacity = '1';

        // Type out text
        for (let i = 0; i < text.length; i++) {
            this.dialogElement.textContent = text.substring(0, i + 1);
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Wait for duration
        await new Promise(resolve => setTimeout(resolve, duration));

        // Fade out
        this.dialogElement.style.opacity = '0';
        await new Promise(resolve => setTimeout(resolve, 500));

        // Complete callback
        if (this.currentCallback) {
            this.currentCallback();
        }

        // Display next dialog if any
        this.displayNext();
    }
}

export const dialogManager = new DialogManager();