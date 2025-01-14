export class BatteryDeath {
    constructor() {
        this.active = false;
        this.container = null;
        this.fadeOverlay = null;
        this.initializeElements();
    }

    initializeElements() {
        // Create main container
        this.container = document.createElement('div');
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: none;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;

        // Create fade overlay
        this.fadeOverlay = document.createElement('div');
        this.fadeOverlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: black;
            opacity: 0;
            transition: opacity 2s ease-in;
            z-index: 999;
        `;

        // Create message text
        const message = document.createElement('div');
        message.textContent = 'Your battery ran out';
        message.style.cssText = `
            color: rgba(137, 145, 124, 1);
            font-family: 'PixelOperatorMono';
            font-size: 3rem;
            margin-bottom: 2rem;
            z-index: 1001;
            opacity: 0;
            transition: opacity 1s ease-in;
            transition-delay: 1s;
        `;

        // Create restart button
        const restartBtn = document.createElement('div');
        restartBtn.textContent = 'Restart';
        restartBtn.style.cssText = `
            color: rgba(137, 145, 124, 1);
            font-family: 'PixelOperatorMono';
            font-size: 2rem;
            margin-bottom: 1rem;
            cursor: pointer;
            z-index: 1001;
            opacity: 0;
            transition: opacity 1s ease-in;
            transition-delay: 1.5s;
        `;
        restartBtn.addEventListener('click', () => window.location.href = 'tv.html');

        // Add elements to container
        this.container.appendChild(this.fadeOverlay);
        this.container.appendChild(message);
        this.container.appendChild(restartBtn);

        // Store references to elements that need opacity changes
        this.elements = [message, restartBtn];
    }

    show() {
        if (this.active) return;
        this.active = true;

        // Add to DOM if not already there
        if (!document.body.contains(this.container)) {
            document.body.appendChild(this.container);
        }

        // Show container
        this.container.style.display = 'flex';

        // Start fade sequence
        requestAnimationFrame(() => {
            this.fadeOverlay.style.opacity = '1';
            this.elements.forEach(el => el.style.opacity = '1');
        });
    }
}