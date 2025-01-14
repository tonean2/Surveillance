// winSequence.js

export class WinSequence {
    constructor() {
        this.overlay = null;
        this.container = null;
        this.initialized = false;
    }

    initialize() {
        if (this.initialized) return;

        // Create overlay
        this.overlay = document.createElement('div');
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: black;
            opacity: 0;
            transition: opacity 5s ease-in;
            z-index: 1000;
            display: none;
        `;

        // Create container for text
        this.container = document.createElement('div');
        this.container.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            color: rgba(137, 145, 124, 0.8);
            opacity: 0;
            transition: opacity 1s ease-in;
        `;

        // Create text elements
        const title = document.createElement('h1');
        title.textContent = 'Surveillance';
        title.style.cssText = `
            font-family: 'PixelOperatorMono';
            font-size: 3rem;
            margin-bottom: 4rem;
        `;

        const restart = document.createElement('div');
        restart.textContent = 'You Won!';
        restart.style.cssText = `
            font-family: 'PixelOperatorMono';
            font-size: 1.6rem;
            margin-bottom: 1rem;
            cursor: pointer;
        `;
        restart.addEventListener('click', () => window.location.reload());

        const exit = document.createElement('div');
        exit.textContent = 'Exit';
        exit.style.cssText = `
            font-family: 'PixelOperatorMono';
            font-size: 1.5rem;
            cursor: pointer;
        `;
        exit.addEventListener('click', () => window.location.href = 'tv.html');

        // Assemble elements
        this.container.appendChild(title);
        this.container.appendChild(restart);
        this.container.appendChild(exit);
        this.overlay.appendChild(this.container);
        document.body.appendChild(this.overlay);

        this.initialized = true;
    }

    start() {
        this.initialize();
        this.overlay.style.display = 'block';
        
        // Trigger fade in
        requestAnimationFrame(() => {
            this.overlay.style.opacity = '1';
            setTimeout(() => {
                this.container.style.opacity = '1';
            }, 1000); // Start fading in text after overlay is partially visible
        });
    }
}