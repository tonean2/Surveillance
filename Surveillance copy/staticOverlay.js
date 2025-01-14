class StaticOverlay {
    constructor() {
        this.overlay = new Image();
        this.overlay.src = './blur/image_2.png';
        this.loaded = false;

        // Track window dimensions at load time
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;

        // Calculate scaling factors
        this.originalWidth = 1280;
        this.originalHeight = 720;

        // Handle image load
        this.overlay.onload = () => {
            this.loaded = true;
            this.calculateDimensions();
        };

        // Bind methods
        this.calculateDimensions = this.calculateDimensions.bind(this);
        this.draw = this.draw.bind(this);

        // Initial calculation
        this.calculateDimensions();
    }

    calculateDimensions() {
        // Calculate dimensions to maintain center position regardless of window size
        const scale = Math.max(
            this.windowWidth / this.originalWidth,
            this.windowHeight / this.originalHeight
        );

        this.width = this.originalWidth * scale;
        this.height = this.originalHeight * scale;

        // Calculate position to center
        this.x = (this.windowWidth - this.width) / 2;
        this.y = (this.windowHeight - this.height) / 2;
    }

    draw(ctx) {
        if (!this.loaded) return;
    
        // Save the current context state
        ctx.save();
    
        // Set global alpha for transparency (0.0 is fully transparent, 1.0 is fully opaque)
        ctx.globalAlpha = 0.0; // Adjust this value to your desired transparency level
    
        // Draw the overlay with transparency
        ctx.drawImage(
            this.overlay,
            this.x,
            this.y,
            this.width,
            this.height
        );
    
        // Restore the context state
        ctx.restore();
    }
    
}

export default StaticOverlay;