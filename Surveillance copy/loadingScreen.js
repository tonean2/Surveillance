export class LoadingScreen {
    constructor() {
        console.log('LoadingScreen constructor called');
        this.initialized = false;
        this.backgroundMusic = new Audio('./audio/background_music3.mp3');
        // Add warning audio files
        this.warningAudios = [
            new Audio('./audio/1Who_goes_there.mp3'),
            new Audio('./audio/2Don\'t_enter.mp3'),
            new Audio('./audio/3Warn_Ya.mp3')
        ];
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
        this.buttonClickSound = new Audio('./audio/button_click.mp3');
        this.warningTimer = null;
        
        // Set initial volumes
        this.sfxVolume = 1.0;
        this.bgmVolume = 1.0;
        this.updateAllVolumes();
    }

    // Add new method to play random warnings
    playRandomWarning() {
        const randomIndex = Math.floor(Math.random() * this.warningAudios.length);
        this.warningAudios[randomIndex].play();
    }
    updateAllVolumes() {
        // Update SFX volumes
        this.warningAudios.forEach(audio => {
            audio.volume = this.sfxVolume;
        });
        this.buttonClickSound.volume = this.sfxVolume;

        // Update background music volume
        this.backgroundMusic.volume = this.bgmVolume;
    }

    // Add method to schedule random warnings
    scheduleRandomWarnings() {
        const scheduleNext = () => {
            // Random time between 15 and 45 seconds
            const nextWarningTime = 15000 + Math.random() * 30000;
            this.warningTimer = setTimeout(() => {
                this.playRandomWarning();
                scheduleNext(); // Schedule next warning
            }, nextWarningTime);
        };
        scheduleNext();
    }

    initialize(parentElement) {
        console.log('LoadingScreen initialize called');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.play();
        
        // Add this line right here to play the warning immediately
        this.warningAudios[0].play();  // This plays "Who goes there" specifically
        
        // Start random warnings (keeping this for subsequent warnings)
        this.scheduleRandomWarnings();
        
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
            color: rgba(137, 145, 124, 1.0);
            font-size: 50px;
            font-family: 'Pixel Operator', monospace;
            opacity: 0;
            transition: opacity 4s ease;
        `;
        this.container.appendChild(surveillanceText);
    
        setTimeout(() => {
            surveillanceText.style.opacity = '1';
        }, 100);
    
        setTimeout(() => {
            this.showMainMenu(); // Proceed to main menu after fade-in
        }, 2000);
    }

    showSettingsScreen() {
        this.clearScreen();
        this.currentScreen = 'settings';

        const settingsContainer = document.createElement('div');
        settingsContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 30px;
        `;

        // Create title
        const title = document.createElement('div');
        title.textContent = 'Settings';
        title.style.cssText = `
            color: rgba(137, 145, 124, 1.0);
            font-size: 35px;
            font-family: 'Pixelify Sans', sans-serif;
            margin-bottom: 20px;
        `;

        // Create volume controls container
        const volumeControls = document.createElement('div');
        volumeControls.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 20px;
            align-items: center;
        `;

        // Background Music Volume Control
        const bgmContainer = document.createElement('div');
        bgmContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: 15px;
        `;

        const bgmLabel = document.createElement('label');
        bgmLabel.textContent = 'Background Music';
        bgmLabel.style.cssText = `
            color: rgba(137, 145, 124, 1.0);
            font-family: 'Pixel Operator', monospace;
            font-size: 20px;
            min-width: 150px;
        `;

        const bgmSlider = document.createElement('input');
        bgmSlider.type = 'range';
        bgmSlider.min = '0';
        bgmSlider.max = '100';
        bgmSlider.value = this.bgmVolume * 100;
        bgmSlider.style.cssText = `
            width: 200px;
            accent-color: rgba(137, 145, 124, 1.0);
        `;

        bgmSlider.addEventListener('input', (e) => {
            this.bgmVolume = e.target.value / 100;
            this.updateAllVolumes();
        });

        // Sound Effects Volume Control
        const sfxContainer = document.createElement('div');
        sfxContainer.style.cssText = bgmContainer.style.cssText;

        const sfxLabel = document.createElement('label');
        sfxLabel.textContent = 'Sound Effects';
        sfxLabel.style.cssText = bgmLabel.style.cssText;

        const sfxSlider = document.createElement('input');
        sfxSlider.type = 'range';
        sfxSlider.min = '0';
        sfxSlider.max = '100';
        sfxSlider.value = this.sfxVolume * 100;
        sfxSlider.style.cssText = bgmSlider.style.cssText;

        sfxSlider.addEventListener('input', (e) => {
            this.sfxVolume = e.target.value / 100;
            this.updateAllVolumes();
        });

        // Append all elements
        bgmContainer.appendChild(bgmLabel);
        bgmContainer.appendChild(bgmSlider);
        sfxContainer.appendChild(sfxLabel);
        sfxContainer.appendChild(sfxSlider);

        volumeControls.appendChild(bgmContainer);
        volumeControls.appendChild(sfxContainer);

        settingsContainer.appendChild(title);
        settingsContainer.appendChild(volumeControls);

        // Create back button
        const backButton = this.createButton('Back', () => {
            this.showMainMenu();
        });

        settingsContainer.appendChild(backButton);
        this.container.appendChild(settingsContainer);
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

            // Play the click sound
            this.buttonClickSound.currentTime = 0; // Reset audio to start
            this.buttonClickSound.play();

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
            Press 'P' to pause<br><br>
            And forgot to mention--don't let your battery run down.
        `;
        helpText.style.cssText = `
            color: rgba(137, 145, 124, 1.0);
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
        const buttonTexts = ['Start', 'Settings', 'Help'];
        buttonTexts.forEach(text => {
            const button = this.createButton(text, () => {
                if (text === 'Start') {
                    this.showGameSelect();
                } else if (text === 'Help') {
                    this.showHelpScreen();
                } else if (text === 'Settings') {
                    this.showSettingsScreen();
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

// In