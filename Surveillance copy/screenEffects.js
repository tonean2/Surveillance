export class ScreenEffects {
    
    constructor() {
        this.flickerOverlay = null;
        this.isFlickering = false;
        this.flickerDuration = 500; // Duration of each flicker in milliseconds
        this.setupFlickerOverlay();
    }

    setupFlickerOverlay() {
        console.log('Screen effects initialized:', this.screenEffects);
        this.flickerOverlay = document.createElement('div');
        this.flickerOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: black;
            opacity: 0;
            pointer-events: none;
            z-index: 9999;
            transition: opacity 50ms linear;
        `;
        document.body.appendChild(this.flickerOverlay);
    }

    async triggerFlicker() {
        if (this.isFlickering) return;
        this.isFlickering = true;
        
        // Quick double flicker
        await this.flicker();
        await new Promise(resolve => setTimeout(resolve, 300));
        await this.flicker();
        
        this.isFlickering = false;
    }

    async flicker() {
        return new Promise(resolve => {
            this.flickerOverlay.style.opacity = '1.0';
            setTimeout(() => {
                this.flickerOverlay.style.opacity = '0';
                setTimeout(resolve, 50);
            }, this.flickerDuration);
        });
    }
}