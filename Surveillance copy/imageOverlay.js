const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

import { dialogManager } from './dialog.js';

class ImageOverlay {
    constructor() {
        // Rectangle position and dimensions - keeping this visible in the game
        this.rect = {
            x: 200,
            y: 300,
            width: 50,
            height: 50
        };

        // Overlay state
        this.showOverlay = false;
        
        // Create overlay container (hidden initially)
        this.createOverlayContainer();
        
        // Bind methods
        this.handleClick = this.handleClick.bind(this);
        this.draw = this.draw.bind(this);
        
        // Add event listener
        canvas.addEventListener('click', this.handleClick);
    }

    createOverlayContainer() {
        // Create container for overlay (no background color)
        this.overlayContainer = document.createElement('div');
        this.overlayContainer.style.cssText = `
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1000;
        `;

        // Create dialog container (for the text)
        this.dialogContainer = document.createElement('div');
        this.dialogContainer.style.cssText = `
            color: white;
            padding: 20px;
            font-family: Arial, sans-serif;
            text-align: center;
        `;
        
        // Append dialog container to overlay container
        this.overlayContainer.appendChild(this.dialogContainer);

        // Add to document
        document.body.appendChild(this.overlayContainer);
    }

    handleClick(e) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
    
        // Check if click is within rectangle
        if (mouseX >= this.rect.x &&
            mouseX <= this.rect.x + this.rect.width &&
            mouseY >= this.rect.y &&
            mouseY <= this.rect.y + this.rect.height) {
            this.overlayContainer.style.display = 'block';
            this.showOverlay = true;
            
            // Add the dialog trigger here
            dialogManager.showDialog([
                "Looks like you can't leave",
                "Well not until you find the clues",
                "to unlock the door",
                "Click around, some of these items", 
                "have codes attached to them",
                "In these codes,",
                "are the numbers you need to leave"
            ], this.dialogContainer); // Pass dialog container to display the dialog
        }
    }

    draw() {
        // Draw the red rectangle
        ctx.fillStyle = 'red';
        ctx.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    }
}

export default ImageOverlay;
