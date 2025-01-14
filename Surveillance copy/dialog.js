import { dialogAudioManager } from './dialogAudioManager.js';

class DialogManager {
    constructor() {
        this.dialogContainer = null;
        this.textElement = null;
        this.currentText = '';
        this.targetText = '';
        this.charIndex = 0;
        this.typingSpeed = 200; // milliseconds per character
        this.dialogQueue = [];
        this.isTyping = false;
        this.isPaused = false;
        this.typeTextTimeout = null;
        this.nextDialogTimeout = null;
        this.eventListeners = {
            'dialogStart': [],
            'dialogEnd': []
        };
    }

    initialize() {
        // Create dialog container
        this.dialogContainer = document.createElement('div');
        this.dialogContainer.style.cssText = `
            position: fixed;
            bottom: 580px;
            left: 20%;
            transform: translateX(-50%);
            padding: 20px;
            border-radius: 5px;
            z-index: 1000;
            display: none;
        `;

        // Create text element
        this.textElement = document.createElement('p');
        this.textElement.style.cssText = `
            color: #c2c3b2;
            font-family: 'PixelOperatorMono';
            font-size: 24px;
            margin: 0;
            min-width: 400px;
            text-align: center;
        `;
        this.dialogContainer.appendChild(this.textElement);
        document.body.appendChild(this.dialogContainer);
    }

    addEventListener(event, callback) {
        if (this.eventListeners[event]) {
            this.eventListeners[event].push(callback);
        }
    }
    
    emitEvent(event) {
        if (this.eventListeners[event]) {
            this.eventListeners[event].forEach(callback => callback());
        }
    }

    pause() {
        this.isPaused = true;
        dialogAudioManager.stopTyping();
        if (this.typeTextTimeout) {
            clearTimeout(this.typeTextTimeout);
            this.typeTextTimeout = null;
        }
        if (this.nextDialogTimeout) {
            clearTimeout(this.nextDialogTimeout);
            this.nextDialogTimeout = null;
        }
    }

    resume() {
        if (!this.isPaused) return;
        
        this.isPaused = false;
        
        // Resume typing if we were in the middle of typing
        if (this.isTyping) {
            this.typeText();
        } else if (this.dialogQueue.length > 0) {
            // Resume showing next dialog if we were between dialogs
            this.showNextDialog();
        }
    }

    showDialog(dialogArray) {
        // Stop any ongoing typing sound
        dialogAudioManager.stopTyping();
        
        // Clear any existing dialogs
        this.dialogQueue = [];
        this.isTyping = false;
        
        // Clear any existing timeouts
        if (this.typeTextTimeout) clearTimeout(this.typeTextTimeout);
        if (this.nextDialogTimeout) clearTimeout(this.nextDialogTimeout);
    
        // Add new dialogs to queue
        this.dialogQueue = [...dialogArray];
        this.dialogContainer.style.display = 'block';
        this.emitEvent('dialogStart');
        if (!this.isPaused) {
            this.showNextDialog();
        }
    }

    showNextDialog() {
        if (this.dialogQueue.length === 0) {
            this.dialogContainer.style.display = 'none';
            this.emitEvent('dialogEnd'); // Add this line
            return;
        }
        
        this.targetText = this.dialogQueue.shift();
        this.currentText = '';
        this.charIndex = 0;
        this.isTyping = true;
        
        if (!this.isPaused) {
            this.typeText();
        }
    }

    typeText() {
        if (this.isPaused) return;
    
        if (this.charIndex < this.targetText.length) {
            // Start typing sound when first character is typed
            if (this.charIndex === 0) {
                dialogAudioManager.startTyping();
            }
            
            this.currentText += this.targetText.charAt(this.charIndex);
            this.textElement.textContent = this.currentText;
            this.charIndex++;
            this.typeTextTimeout = setTimeout(() => this.typeText(), this.typingSpeed);
        } else {
            // Stop typing sound when text is complete
            dialogAudioManager.stopTyping();
            
            this.isTyping = false;
            this.nextDialogTimeout = setTimeout(() => {
                if (!this.isTyping && !this.isPaused) {
                    this.showNextDialog();
                }
            }, 3000);
        }
    }
}

export const dialogManager = new DialogManager();