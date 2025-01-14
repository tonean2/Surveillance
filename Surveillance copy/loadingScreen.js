export class LoadingScreen {
    constructor() {
        console.log('LoadingScreen constructor called');
        this.initialized = false;
        this.container = null;
        this.buttons = [];
        this.backgroundImage = new Image();
        this.backgroundImage.src = './black_screen11_2.png';
        this.gameSelectBackground = new Image();
        this.gameSelectBackground.src = './black_screen11_2.png';
        this.isTransitioning = false;
        this.currentScreen = 'main';
        this.title = null;
        this.gridContainer = null;
        this.gameContainer = null;
    }

    initialize(parentElement) {
        console.log('LoadingScreen initialize called');
        if (this.initialized) return;
        
        // Create the game container but keep it hidden initially
        this.gameContainer = document.createElement('div');
        this.gameContainer.className = 'crt-container';
        this.gameContainer.style.display = 'none';
        this.gameContainer.innerHTML = `
            <canvas id="gameCanvas"></canvas>
            <div class="ball-text">ball</div>
            <div class="crt-overlay"></div>
            <div class="moving-lines"></div>
            <div class="curved-screen"></div>
            <div id="dialogBox">
                <span class="close-dialog" onclick="closeDialog()">×</span>
                <h2>Ball</h2> 
                <pre id="codeBlock"></pre>
            </div>
        `;
        parentElement.appendChild(this.gameContainer);
        
        this.container = document.createElement('div');
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 20px;
            z-index: 1000;
            background-size: cover;
            background-position: center;
        `;
        this.showSurveillanceText();

        this.showMainMenu();

        this.backgroundImage.onload = () => {
            this.container.style.backgroundImage = `url('${this.backgroundImage.src}')`;
        };

        parentElement.appendChild(this.container);
        this.initialized = true;
        console.log('LoadingScreen initialization complete');
    }

    showSurveillanceText() {
        this.clearScreen(); // Ensure no residual elements
        const surveillanceText = document.createElement('div');
        surveillanceText.textContent = 'Surveillance';
        surveillanceText.style.cssText = `
            color: white;
            font-size: 50px;
            font-family: 'Pixel Operator', monospace;
            opacity: 0;
            transition: opacity 7s ease;
        `;
        this.container.appendChild(surveillanceText);
    
        setTimeout(() => {
            surveillanceText.style.opacity = '1';
        }, 100);
    
        setTimeout(() => {
            this.showMainMenu(); // Proceed to main menu after fade-in
        }, 2000);
    }
    
    clearScreen() {
        // Clear buttons
        this.buttons.forEach(button => button.remove());
        this.buttons = [];
    
        // Clear title if it exists
        if (this.title) {
            this.title.remove();
            this.title = null;
        }
    
        // Clear grid container if it exists
        if (this.gridContainer) {
            this.gridContainer.remove();
            this.gridContainer = null;
        }
    
        // Remove all child elements from the container (like "Surveillance" text)
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
    
        // Reset background to default
        this.container.style.backgroundImage = `url('${this.backgroundImage.src}')`;
    }
    

    createButton(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            padding: 10px 30px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: 'Pixelify Sans', sans-serif;
        `;

        button.addEventListener('mouseenter', () => {
            button.style.color = 'rgba(137, 145, 124, 0.8)';
            button.style.border = '2px solid rgba(137, 145, 124, 0.8)';
            button.style.borderRadius = '15px';
        });

        button.addEventListener('mouseleave', () => {
            button.style.color = 'white';
            button.style.border = button.classList.contains('room-button') ? '2px solid #D3D3D3' : 'none';
        });

        button.addEventListener('click', () => {
            if (this.isTransitioning) return;
            this.isTransitioning = true;

            let blinkCount = 0;
            const blinkInterval = setInterval(() => {
                button.style.opacity = button.style.opacity === '0' ? '1' : '0';
                blinkCount++;
                
                if (blinkCount >= 6) {
                    clearInterval(blinkInterval);
                    onClick();
                    this.isTransitioning = false;
                }
            }, 100);
        });

        return button;
    }

    showHelpScreen() {
        this.clearScreen(); // Clear any existing content before showing help
        this.currentScreen = 'help';
        
        // Create help text
        const helpText = document.createElement('div');
        helpText.innerHTML = `
            You find yourself trapped in a room with a  madman who has left you a challenge. 
            This is a puzzle-solving game where your ability to think outside the box will be put to the test. 
            Click on some items in the room to reveal their codes. Each code contains a puzzle to be solved. 
            Crack the right four puzzles to uncover the numbers needed to unlock the door and escape. 
            But beware—some of these codes are decoys designed to lead you away from the right ones. 
            Can you outsmart your way to freedom?<br><br>
            Press 'P' to pause and 'AWSD' to move.<br><br>
            And forgot to mention--don't let your battery run down.
        `;
        helpText.style.cssText = `
            color: white;
            font-size: 20px; /* Adjust font size as necessary */
            font-family: 'Pixel Operator', monospace; /* Your custom font */
            text-align: center;
            margin: 20px;
            max-width: 600px; /* Limit the width of the text */
        `;
        this.container.appendChild(helpText);
        
        // Create "Back" button
        const backButton = this.createButton('Back', () => {
            this.showMainMenu(); // Go back to the main menu
        });
        this.buttons.push(backButton);
        this.container.appendChild(backButton);
    }
    

    showMainMenu() {
        this.clearScreen();
        this.currentScreen = 'main';
    
        // Display the "Surveillance" text
        const surveillanceText = document.createElement('div');
        surveillanceText.textContent = 'Surveillance';
        surveillanceText.style.cssText = `
            color: white;
            font-size: 50px;
            font-family: 'Pixel Operator', monospace;
            opacity: 0;
            transition: opacity 10s ease;
            margin-top: -100px; // Add this line (adjust the value as needed)
        `;
        this.container.appendChild(surveillanceText);
    
        setTimeout(() => {
            surveillanceText.style.opacity = '1';
        }, 100);
    
        // Add menu buttons
        const buttonTexts = ['Hi', 'Settings', 'Help'];
        buttonTexts.forEach(text => {
            const button = this.createButton(text, () => {
                if (text === 'Hi') {
                    this.showGameSelect();
                } else if (text === 'Help') {
                    this.showHelpScreen();
                }
            });
            this.buttons.push(button);
            this.container.appendChild(button);
        });
    }
    

    showGameSelect() {
        this.clearScreen();
        this.currentScreen = 'gameSelect';

        // Create "Select Game" button
        const selectButton = this.createButton('Select Room', () => {
            this.showRoomSelect();
        });
        this.buttons.push(selectButton);
        this.container.appendChild(selectButton);

        // Create "Back" button
        const backButton = this.createButton('Back', () => {
            this.showMainMenu();
        });
        this.buttons.push(backButton);
        this.container.appendChild(backButton);
    }

// Inside the showRoomSelect method
    showRoomSelect() {
        this.clearScreen();
        this.currentScreen = 'roomSelect';
        this.container.style.backgroundImage = `url('${this.gameSelectBackground.src}')`;

        // Create title
        this.title = document.createElement('div');
        this.title.textContent = 'Select a Room';
        this.title.style.cssText = `
            color: rgba(137, 145, 124, 0.9);
            font-size: 35px;
            margin-bottom: 40px;
            font-family: 'Pixelify Sans', sans-serif;
        `;
        this.container.appendChild(this.title);

        // Create grid container for room buttons
        this.gridContainer = document.createElement('div');
        this.gridContainer.style.cssText = `
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 40px;
        `;

        // Create room buttons
        for (let i = 1; i <= 4; i++) {
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = `
                position: relative;
                min-width: 200px;
            `;

            const button = document.createElement('button');
            button.classList.add('room-button');
            button.style.cssText = `
                background: none;
                border: 2px solid #D3D3D3;
                border-radius: 15px;
                color: white;
                font-size: 24px;
                padding: 10px 30px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-family: 'Pixelify Sans', sans-serif;
                width: 100%;
                display: flex;
                align-items: center;
                gap: 10px;
            `;

            const numberSpan = document.createElement('span');
            numberSpan.textContent = `#${i}`;
            button.appendChild(numberSpan);

            // Initially hide the label
            const labelSpan = document.createElement('span');
            labelSpan.textContent = i === 1 ? 'The Rec' : 'Coming Soon';
            labelSpan.style.cssText = `
                margin-left: 10px;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            button.appendChild(labelSpan);

            button.addEventListener('mouseenter', () => {
                button.style.border = '2px solid rgba(137, 145, 124, 0.8)';
                numberSpan.style.color = 'rgba(137, 145, 124, 0.8)';
                labelSpan.style.color = 'rgba(137, 145, 124, 0.8)';
                labelSpan.style.opacity = '1';
            });

            button.addEventListener('mouseleave', () => {
                button.style.border = '2px solid #D3D3D3';
                numberSpan.style.color = 'white';
                labelSpan.style.color = 'white';
                labelSpan.style.opacity = '0';  // Hide the label when not hovering
            });

            button.addEventListener('click', () => {
                if (this.isTransitioning) return;
                this.isTransitioning = true;

                let blinkCount = 0;
                const blinkInterval = setInterval(() => {
                    button.style.opacity = button.style.opacity === '0' ? '1' : '0';
                    blinkCount++;
                    
                    if (blinkCount >= 6) {
                        clearInterval(blinkInterval);
                        if (i === 1) {
                            this.showFinalScreen();
                        }
                        this.isTransitioning = false;
                    }
                }, 100);
            });

            buttonContainer.appendChild(button);
            this.gridContainer.appendChild(buttonContainer);
        }

        this.container.appendChild(this.gridContainer);

        // Create back arrow
        const backButton = this.createButton('Back', () => {
            this.showGameSelect();
        });
        this.buttons.push(backButton);
        this.container.appendChild(backButton);
    }

    showFinalScreen() {
        this.clearScreen();
        this.currentScreen = 'final';
        
        // Add flicker effect before transition
        this.container.classList.add('tv-flicker');
        
        setTimeout(() => {
            this.container.classList.remove('tv-flicker');
            this.transition();
        }, 200);
    }

    transition() {
        // Add TV turn off effect
        this.container.classList.add('tv-turn-off');
        
        // Make sure game container is ready but hidden
        const gameContainer = document.querySelector('.crt-container');
        if (gameContainer) {
            gameContainer.style.display = 'block';
            gameContainer.style.opacity = '2';
            gameContainer.style.visibility = 'visible';
        }
        
        // After TV turn off animation completes
        setTimeout(() => {
            // Fade in the game container
            if (gameContainer) {
                gameContainer.style.transition = 'opacity 0.5s ease';
                gameContainer.style.opacity = '1';
            }
            
            // Remove the loading screen
            setTimeout(() => {
                this.container.remove();
                const event = new Event('loadingScreenComplete');
                document.dispatchEvent(event);
            }, 500);
        }, 800); // Match this with the animation duration (0.8s = 800ms)
    }
}