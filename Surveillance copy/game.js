const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const ballText = document.querySelector('.ball-text');
const dialogBox = document.getElementById('dialogBox');

import { dialogManager } from './dialog.js';  // Add this here
import ImageOverlay from './imageOverlay.js';
import { ScreenEffects } from './screenEffects.js';
import { WinSequence } from './winSequence.js';
import { BatteryDeath } from './batteryDeath.js';
import StaticOverlay from './staticOverlay.js';
import AudioManager from './audioManager.js';



// Make closeDialog availaxfe globally
window.closeDialog = function() {
    dialogBox.style.display = 'none';
};

const CIRCLE_POSITIONS = [
    {
        xPercent: 0.65,
        yPercent: 0.72,
        radius: 15
    },
    {
        xPercent: 0.78,  // New circle position
        yPercent: 0.70,
        radius: 15
    },
    
    {
        xPercent: 0.67,  // New circle position
        yPercent: 0.68,
        radius: 15
    }
];

const BATTERY_CONFIG = {
    x: 24,
    y: window.innerHeight - 40,
    width: 100,  // Reduced from 150
    height: 30,  // Reduced from 40
    segments: 5,
    segmentGap: 3,  // Reduced from 4
    borderWidth: 1,
    terminalWidth: 6,  // New: width of battery terminal
    terminalHeight: 12  // New: height of battery terminal
};

class Game {
    constructor() {
        this.timeEditing = false;
        this.editingPart = null; // 'hours', 'minutes', or 'seconds'
        this.editingValue = '';
        this.timeDisplay = null;
        this.squareContents = {
            number: ['4', '7', '', ''],  // Numbers for each square
            opacity: [0, 0, 0, 0]        // Opacity for each square
        };

        this.squareOneAnimated = false;
        this.squareTwoAnimated = false;
        this.squareThreeAnimated = false;
        this.squareFourAnimated = false;
        this.audioManager = new AudioManager();
        this.winSequence = new WinSequence();
        this.batteryDeath = new BatteryDeath();
        this.staticOverlay = new StaticOverlay();
        this.hasWon = false;
        
        this.paused = false;
        this.dialogPaused = false;
        this.pauseMenu = document.getElementById('pauseMenu');
        this.initialized = false;
        this.imageOverlay = new ImageOverlay();
        this.startTime = new Date();
        this.startTime.setHours(23, 3, 0);
        this.batteryLevel = BATTERY_CONFIG.segments;
        this.screenEffects = new ScreenEffects();
        this.lastBatteryUpdate = Date.now();
        this.gameStartTime = Date.now(); // New: track when game started
        this.letterboxHeight = 0;
        this.letterboxActive = false;
        this.letterboxElements = null;
        this.maxDots = 1;
        this.activeDots = 0;
        this.dots = new Set();
        this.overlayImages = [
            {
                id: 'ball',
                src: './assets/export16_ball.png',
                x: 300,
                y: 200,
                width: 50,
                height: 50
            }
        ];

        this.animationFrames = [];
        this.currentFrame = 0;
        this.frameCount = 8; // Total number of frames
        this.frameDuration = 125; // Duration for each frame in milliseconds (8 frames per second)
        this.lastFrameTime = 0;

        this.backgroundState = {
            currentState: 'initial',
            animationStartTime: null,
            animationDuration: this.frameCount * this.frameDuration // This will be 8 * 125 = 1000ms
        };

        this.gameAssets = {
            background: {
                initialImage: new Image(),
                gifImage: new Image(),
                updatedImage: new Image(),
                currentImage: null
            },
            character: {
                image: new Image()
            },
            overlays: new Map()
        };

        // Bind methods to this context
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.gameLoop = this.gameLoop.bind(this);
        this.resizeCanvas = this.resizeCanvas.bind(this);
        this.updateTime = this.updateTime.bind(this);
        this.updateBattery = this.updateBattery.bind(this);
        this.drawBattery = this.drawBattery.bind(this);    
        this.drawSquares = this.drawSquares.bind(this);
        this.initializeLetterbox = this.initializeLetterbox.bind(this);
        this.activateLetterbox = this.activateLetterbox.bind(this);
        this.deactivateLetterbox = this.deactivateLetterbox.bind(this);


        this.gameAssets.background.initialImage.src = './assets/export_19_2.png';
        this.gameAssets.background.updatedImage.src = './gif/export_19_2-16.png';
        
        // Set initial background
        this.gameAssets.background.currentImage = this.gameAssets.background.initialImage;

        for (let i = 1; i <= this.frameCount; i++) {
            const img = new Image();
            img.src = `./gif/export_19_2-${i}.png`;
            img.onload = () => console.log(`Frame ${i} loaded successfully`);
            img.onerror = () => console.error(`Failed to load frame ${i}`);
            this.animationFrames.push(img);
        }


        // Bind new methods
        this.switchBackground = this.switchBackground.bind(this);
        this.handleCodeChange = this.handleCodeChange.bind(this);
        this.batteryLevel = 100; // Start with full battery

    }
    spawnDot(initial = false) {
        if (this.activeDots > this.maxDots) return;
        
        const dot = document.createElement('div');
        dot.classList.add('dot');
        dot.style.top = `${Math.random() * window.innerHeight}px`;
        dot.style.left = initial ? `${Math.random() * window.innerWidth}px` : '0px';
        const speed = Math.random() * 3 + 1;
        dot.dataset.speed = speed.toString();
        
        this.activeDots++;
        document.querySelector('.crt-container').appendChild(dot);
        
        if (!this.paused) {
            const movementInterval = setInterval(() => {
                if (!this.paused) {
                    const currentLeft = parseFloat(dot.style.left);
                    if (currentLeft >= window.innerWidth + 10) {
                        clearInterval(movementInterval);
                        dot.remove();
                        this.activeDots--;
                        this.dots.delete(dot);
                    } else {
                        dot.style.left = `${currentLeft + speed}px`;
                    }
                }
            }, 16);
            dot.dataset.movementInterval = movementInterval.toString();
        }
        
        this.dots.add(dot);
    }

    animateSecondSquare() {
        if (this.squareTwoAnimated) return;
        this.squareTwoAnimated = true;
        
        // Flash effect
        const square = document.querySelector('#squares-container div:nth-child(2)');
        square.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        
        setTimeout(() => {
            square.style.transition = 'background-color 0.5s ease-out';
            square.style.backgroundColor = 'rgba(47, 62, 60, 0.2)';
            
            // Add number with fade in
            const numberDiv = document.createElement('div');
            numberDiv.textContent = this.squareContents.number[1];  // Use '7' from the array
            numberDiv.style.cssText = `
                position: absolute;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                color: rgba(137, 145, 124, 0);
                font-family: 'PixelOperatorMono';
                font-size: 2rem;
                transition: color 1s ease-in;
            `;
            square.appendChild(numberDiv);
            
            // Trigger fade in
            setTimeout(() => {
                numberDiv.style.color = 'rgba(137, 145, 124, 0.8)';
                
                // Add dialog sequence after fade-in completes
                setTimeout(() => {
                    if (dialogManager) {
                        dialogManager.showDialog([
                            "Hmm...",
                            "Seeems like another number appears",
                            "Battery is running out",
                            "Better hurry"
                        ],{

                            position: {
                                bottom: '77vh',  // Adjust this value to position the dialog higher or lower
                                left: '20%',
                                transform: 'translateX(-50%)'
                            }
                        });

                    }
                }, 1000);
            }, 50);
        }, 100);
    }
    animateFourthSquare() {
        if (this.squareFourAnimated) return;
        this.squareFourAnimated = true;
        
        // Get the fourth square
        const square = document.querySelector('#squares-container div:nth-child(4)');
        if (!square) return;
        
        // Flash effect
        square.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        
        setTimeout(() => {
            square.style.transition = 'background-color 0.5s ease-out';
            square.style.backgroundColor = 'rgba(47, 62, 60, 0.2)';
            
            // Add number with fade in
            const numberDiv = document.createElement('div');
            numberDiv.textContent = '1';
            numberDiv.style.cssText = `
                position: absolute;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                color: rgba(137, 145, 124, 0);
                font-family: 'PixelOperatorMono';
                font-size: 2rem;
                transition: color 1s ease-in;
            `;
            square.appendChild(numberDiv);
            
            // Trigger fade in
            setTimeout(() => {
                numberDiv.style.color = 'rgba(137, 145, 124, 0.8)';
            }, 50);
        }, 100);
    }

    animateThirdSquare() {
        if (this.squareThreeAnimated) return;
        this.squareThreeAnimated = true;
        
        // Flash effect
        const square = document.querySelector('#squares-container div:nth-child(3)');
        square.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        
        setTimeout(() => {
            square.style.transition = 'background-color 0.5s ease-out';
            square.style.backgroundColor = 'rgba(47, 62, 60, 0.2)';
            
            // Add number with fade in
            const numberDiv = document.createElement('div');
            numberDiv.textContent = '3';  // The number to display
            numberDiv.style.cssText = `
                position: absolute;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                color: rgba(137, 145, 124, 0);
                font-family: 'PixelOperatorMono';
                font-size: 2rem;
                transition: color 1s ease-in;
            `;
            square.appendChild(numberDiv);
            
            // Trigger fade in
            setTimeout(() => {
                numberDiv.style.color = 'rgba(137, 145, 124, 0.8)';
                
                // Add dialog sequence after fade-in completes with lower position
                setTimeout(() => {
                    if (dialogManager) {
                        dialogManager.showDialog([
                            "...",
                            "Seems like you called",
                            "the right number",
                            "Maybe I SHOULD let you",
                            "live"

                        ], {
                            position: {
                                bottom: '77vh',
                                left: '20%',
                                transform: 'translateX(-50%)'
                            },
                        });
                    }
                }, 1000);
            }, 50);
        }, 100);
    }
    checkWinCondition() {
        if (this.squareOneAnimated && 
            this.squareTwoAnimated && 
            this.squareThreeAnimated && 
            this.squareFourAnimated && 
            !this.hasWon) {
            
            this.hasWon = true;
            this.winSequence.start();
                        
            // Hide other UI elements
            const uiElements = [
                document.getElementById('battery-container'),
                document.getElementById('squares-container'),
                document.querySelector('.hover-text'),
                ...document.querySelectorAll('.letterbox')
            ];
            
            uiElements.forEach(element => {
                if (element) element.style.display = 'none';
            });
        }
    }
    
    checkPhoneNumber(input) {
        // Remove all non-digit characters and compare
        const cleanedInput = input.replace(/\D/g, '');
        if (cleanedInput === '4041014040') {
            this.animateThirdSquare();
            return true;
        }
        return false;
    }
    
    switchBackground(state) {
        switch(state) {
            case 'animation':
                this.backgroundState.currentState = 'animation';
                this.backgroundState.animationStartTime = Date.now();
                this.currentFrame = 0;
                // Activate letterbox as soon as animation starts
                this.activateLetterbox();
                break;
            case 'final':
                this.backgroundState.currentState = 'final';
                this.gameAssets.background.currentImage = this.gameAssets.background.updatedImage;
                // Deactivate letterbox when animation ends
                this.deactivateLetterbox();
                break;
            default:
                this.backgroundState.currentState = 'initial';
                this.gameAssets.background.currentImage = this.gameAssets.background.initialImage;
        }
    }
    animateFirstSquare() {
        if (this.squareOneAnimated) return;
        this.squareOneAnimated = true;
        
        // Flash effect
        const square = document.querySelector('#squares-container div:first-child');
        square.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        
        setTimeout(() => {
            square.style.transition = 'background-color 0.5s ease-out';
            square.style.backgroundColor = 'rgba(47, 62, 60, 0.2)';
            
            // Add number with fade in
            const numberDiv = document.createElement('div');
            numberDiv.textContent = this.squareContents.number[0]; // Changed from this.squareContent.number
            numberDiv.style.cssText = `
                position: absolute;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                color: rgba(137, 145, 124, 0);
                font-family: 'PixelOperatorMono';
                font-size: 2rem;
                transition: color 1s ease-in;
            `;
            square.appendChild(numberDiv);
            
            // Trigger fade in
            setTimeout(() => {
                numberDiv.style.color = 'rgba(137, 145, 124, 0.8)';
                
                // Add dialog sequence after fade-in completes
                setTimeout(() => {
                    if (dialogManager) {
                        dialogManager.showDialog([
                            "Looks like you found the first number",
                            "Lucky guess",
                            "Better hurry",
                            "Before the battery runs out"
                        ], {

                            position: {
                                bottom: '77vh',  // Adjust this value to position the dialog higher or lower
                                left: '20%',
                                transform: 'translateX(-50%)'
                            }
                        });

                    }
                }, 1000);
                
            }, 50);
        }, 100);
    }

    handleCodeChange(code) {
        const lines = code.split('\n');
        
        // Check for ball position changes
        const hasUncommentedBallX = lines.some(line => 
            line.trim() === 'ballX = holeX;'
        );
        const hasUncommentedBallY = lines.some(line => 
            line.trim() === 'ballY = holeY;'
        );
        
        // More precise check for the "4" revelation
        const numberRevealCheck = lines.reduce((acc, line, index) => {
            if (line.trim() === '//The first number is' && 
                lines[index + 1]?.trim() === '4') {  // Note: removed the '//' requirement
                return true;
            }
            return acc;
        }, false);
    
        // Handle animation sequence
        if (hasUncommentedBallX && hasUncommentedBallY && 
            this.backgroundState.currentState === 'initial') {
            this.switchBackground('animation');
            setTimeout(() => {
                this.switchBackground('final');
            }, this.backgroundState.animationDuration);
        }
    
        // Handle number 4 reveal
        if (numberRevealCheck && !this.squareOneAnimated) {
            this.animateFirstSquare();
        }
    }
    

    initialize() {
        if (this.initialized) return;
        console.log('Game initializing...');
        this.setupPauseMenuListeners();

        const yellowRect = document.getElementById('yellowRectangle');
        if (yellowRect) {
            yellowRect.addEventListener('click', () => {
                window.showDialog2();
            });
        }

        const pinkRect = document.getElementById('pinkRectangle');
        if (pinkRect) {
            pinkRect.addEventListener('click', () => {
                window.showDialog3();
            });
        }

        const greenRect = document.getElementById('greenRectangle');
        if (greenRect) {
            greenRect.addEventListener('click', () => {
                window.showDialog7();
            });
        }
        const blueRect = document.getElementById('blueRectangle');
        if (blueRect) {
            blueRect.addEventListener('click', () => {
                window.showDialog4();
            });
        }
        const purpleRect = document.getElementById('purpleRectangle');
        if (purpleRect) {
            purpleRect.addEventListener('click', () => {
                window.showDialog5();
            });
        }

        const orangeRect = document.getElementById('orangeRectangle');
        if (orangeRect) {
            orangeRect.addEventListener('click', () => {
                window.showDialog6();
            });
        }
        // Make instance globally available
        window.game = this;
        // Create text overlay container
        const textOverlay = document.createElement('div');
        textOverlay.style.cssText = `
            position: absolute;
            top: 24px;
            left: 24px;
            z-index: 6; /* Add this line */
            color: white;
            pointer-events: none;
        `;
        
        // Create time display container
        // Create time container
        const timeContainer = document.createElement('div');
        timeContainer.style.cssText = `
            position: absolute;
            top: 24px;
            right: 24px;
            z-index: 6;
            text-align: right;
        `;

        // Create time display
        const timeDisplay = document.createElement('div');
        timeDisplay.id = 'timeDisplay';
        timeDisplay.style.cssText = `
            color: #c2c3b2;
            font-size: 2rem;
            font-family: 'PixelOperatorMono';
            pointer-events: all;
            cursor: pointer;
            filter: blur(0.2px);
            text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
            margin-bottom: 4px;
        `;

        // Store reference to timeDisplay
        this.timeDisplay = timeDisplay;

        // Add click event listener for time editing
        timeDisplay.addEventListener('click', (e) => this.handleTimeClick(e));

        // Add document click listener to handle clicking away
        document.addEventListener('click', (e) => {
            if (this.timeEditing && e.target !== this.timeDisplay) {
                this.stopTimeEditing();
            }
        });

        // Add keydown listener for time editing
        document.addEventListener('keydown', (e) => this.handleTimeKeydown(e));

        // Create date display
        const dateDisplay = document.createElement('div');
        dateDisplay.textContent = '7/27/01';
        dateDisplay.style.cssText = `
            position: absolute;
            right: 40px;
            color: #c2c3b2;
            font-size: 1.5rem;
            font-family: 'PixelOperatorMono';
            pointer-events: none;
            filter: blur(0.2px);
            text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
        `;

        timeContainer.appendChild(timeDisplay);
        timeContainer.appendChild(dateDisplay);
        
        // Add font face
        const fontFace = new FontFace('PixelOperatorMono', 'url(./fonts/pixel_operator/PixelOperatorMono.ttf)');
        fontFace.load().then(font => {
            document.fonts.add(font);

            // Initialize dialog manager
            dialogManager.initialize();
            
            // Show welcome dialog
            dialogManager.showDialog([
                "Welcome",
                "I've been expecting you",
                "Go on, try to leave",
                "Go click the door.."
            ], {
                position: {
                    bottom: '77vh',
                    left: '20%',
                    transform: 'translateX(-50%)'

                }
            });
            

            
            
            const titleText = document.createElement('h1');
            titleText.textContent = 'The Rec';
            titleText.style.cssText = `
                font-family: 'PixelOperatorMono';
                font-size: 1.8rem;
                margin-bottom: 4px;
                color: #c2c3b2;
                filter: blur(0.2px);
                text-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
                z-index: 50; /* Add this line */
                position: relative; /* Add this line */
            `;
            
            // Create subtitle text
            const subtitleText = document.createElement('p');
            subtitleText.textContent = 'Camera_1';
            subtitleText.style.cssText = `
                font-family: 'PixelOperatorMono';
                font-size: 1.5rem;
                color: #c2c3b2;
                filter: blur(0.2px);
                text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
                z-index: 50; /* Add this line */
                position: relative; /* Add this line */
            `;
            textOverlay.appendChild(titleText);
            textOverlay.appendChild(subtitleText);


        }).catch(err => {
            console.error('Failed to load PixelOperatorMono font:', err);
        });

        // Show game container
        const gameContainer = document.querySelector('.crt-container');
        if (gameContainer) {
            gameContainer.style.display = 'block';
            gameContainer.style.opacity = '1';
            gameContainer.style.visibility = 'visible';
            gameContainer.appendChild(textOverlay);
            gameContainer.appendChild(timeContainer);
        }
        
        // Add event listeners
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
        canvas.addEventListener('mousemove', this.handleMouseMove);
        canvas.addEventListener('click', this.handleClick);
        window.addEventListener('resize', this.resizeCanvas);

        this.resizeCanvas();
        this.initializeAssets();
        this.gameLoop();
        this.updateTime();
        this.initializeLetterbox(); // Initialize letterbox elements
        this.audioManager.initialize();



        
        this.initialized = true;

        for (let i = 0; i < this.maxDots; i++) {
            this.spawnDot(true);
        }
        
        // Spawn new dots periodically
        setInterval(() => {
            this.spawnDot(false);
        }, 1000);
    }

    
    handleTimeClick(e) {
        if (!this.timeEditing) {
            this.timeEditing = true;
            // Store the current time when editing starts
            this.editStartTime = new Date(this.startTime.getTime() + (Date.now() - this.gameStartTime));
            this.startTime = this.editStartTime;
            
            const timeString = this.timeDisplay.textContent;
            const clickX = e.offsetX;
            const width = this.timeDisplay.offsetWidth;
            
            // Determine which part was clicked (HH:MM:SS)
            if (clickX < width / 3) {
                this.editingPart = 'hours';
            } else if (clickX < (width * 2) / 3) {
                this.editingPart = 'minutes';
            } else {
                this.editingPart = 'seconds';
            }
            
            this.editingValue = '';
            this.highlightEditingPart();
        }
    }

    handleTimeKeydown(e) {
        if (!this.timeEditing) return;

        if (e.key === 'Enter') {
            this.stopTimeEditing();
            return;
        }

        if (e.key === 'Tab') {
            e.preventDefault();
            this.switchEditingPart();
            return;
        }

        if (e.key === 'Escape') {
            this.stopTimeEditing(true); // true means cancel editing
            return;
        }

        if (e.key.match(/[0-9]/)) {
            this.editingValue += e.key;
            if (this.editingValue.length === 2) {
                let value = parseInt(this.editingValue);
                const max = this.editingPart === 'hours' ? 23 : 59;
                
                if (value > max) value = max;
                
                const time = new Date(this.startTime);
                if (this.editingPart === 'hours') time.setHours(value);
                if (this.editingPart === 'minutes') time.setMinutes(value);
                if (this.editingPart === 'seconds') time.setSeconds(value);
                
                this.startTime = time;
                this.switchEditingPart();
            }
            this.updateTimeDisplay();
        }
    }

    switchEditingPart() {
        const parts = ['hours', 'minutes', 'seconds'];
        const currentIndex = parts.indexOf(this.editingPart);
        this.editingPart = parts[(currentIndex + 1) % 3];
        this.editingValue = '';
        this.highlightEditingPart();
    }

    highlightEditingPart() {
        const time = this.timeDisplay.textContent.split(':');
        const parts = ['hours', 'minutes', 'seconds'];
        const index = parts.indexOf(this.editingPart);
        
        time[index] = `<span style="background: rgba(194, 195, 178, 0.3); padding: 0 2px;">${time[index]}</span>`;
        this.timeDisplay.innerHTML = time.join(':');
    }

    stopTimeEditing(cancel = false) {
        if (!cancel) {
            // Update the game start time to maintain correct timing
            this.gameStartTime = Date.now();
        }
        
        this.timeEditing = false;
        this.editingPart = null;
        this.editingValue = '';
        this.updateTimeDisplay(this.startTime);
    }

    updateTime() {
        if (!this.timeDisplay) return;
        
        if (!this.paused && !this.timeEditing) {
            const elapsedTime = Date.now() - this.gameStartTime;
            const currentTime = new Date(this.startTime.getTime() + elapsedTime);
            this.updateTimeDisplay(currentTime);
            
            // Check for 11:59:59 trigger
            if (currentTime.getHours() === 23 && 
                currentTime.getMinutes() === 59 && 
                currentTime.getSeconds() === 59 && 
                !this.squareTwoAnimated) {  // Add check for not already animated
                this.animateSecondSquare();
            }
        }
        
        requestAnimationFrame(this.updateTime);
    }

    updateTimeDisplay(time = this.startTime) {
        if (!this.timeDisplay) return;
        
        const hours = time.getHours().toString().padStart(2, '0');
        const minutes = time.getMinutes().toString().padStart(2, '0');
        const seconds = time.getSeconds().toString().padStart(2, '0');
        
        if (this.timeEditing) {
            // During editing, highlight the part being edited
            const parts = [hours, minutes, seconds];
            const index = ['hours', 'minutes', 'seconds'].indexOf(this.editingPart);
            
            if (index !== -1) {
                parts[index] = `<span style="background: rgba(194, 195, 178, 0.3); padding: 0 2px;">${parts[index]}</span>`;
            }
            
            this.timeDisplay.innerHTML = parts.join(':');
        } else {
            this.timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
        }
    }

    

    initializeLetterbox() {
        if (!this.letterboxElements) {
            const topBar = document.createElement('div');
            const bottomBar = document.createElement('div');
            
            topBar.className = 'letterbox top';
            bottomBar.className = 'letterbox bottom';
            
            this.letterboxHeight = Math.round(window.innerHeight * 0.15);
            topBar.style.height = `${this.letterboxHeight}px`;
            bottomBar.style.height = `${this.letterboxHeight}px`;
            
            document.querySelector('.crt-container').appendChild(topBar);
            document.querySelector('.crt-container').appendChild(bottomBar);
            
            this.letterboxElements = {
                top: topBar,
                bottom: bottomBar
            };
        }
    }

    togglePause() {
        this.paused = !this.paused;
        this.audioManager.handlePauseState(this.paused);
        
        if (this.paused) {
            // Pause menu display
            this.pauseMenu.style.display = 'flex';
            
            // Freeze the current frame of the GIF

            
            // Pause all dots
            this.dots.forEach(dot => {
                dot.style.animationPlayState = 'paused';
                const movementInterval = dot.dataset.movementInterval;
                if (movementInterval) {
                    clearInterval(parseInt(movementInterval));
                }
            });
            
            // Pause dialog system
            if (dialogManager) {
                dialogManager.pause();
                if (dialogManager.dialogContainer) {
                    dialogManager.dialogContainer.style.display = 'none';
                }
            }
        } else {
            // Resume game
            this.pauseMenu.style.display = 'none';
            
            
            // Resume all dots
            this.dots.forEach(dot => {
                dot.style.animationPlayState = 'running';
                const speed = parseFloat(dot.dataset.speed) || Math.random() * 3 + 1;
                const movementInterval = setInterval(() => {
                    if (!this.paused) {
                        const currentLeft = parseFloat(dot.style.left);
                        if (currentLeft >= window.innerWidth + 10) {
                            clearInterval(movementInterval);
                            dot.remove();
                            this.activeDots--;
                            this.dots.delete(dot);
                        } else {
                            dot.style.left = `${currentLeft + speed}px`;
                        }
                    }
                }, 16);
                dot.dataset.movementInterval = movementInterval.toString();
            });
            
            // Resume dialog system
            if (dialogManager) {
                dialogManager.resume();
                if (dialogManager.dialogQueue.length > 0 || dialogManager.isTyping) {
                    dialogManager.dialogContainer.style.display = 'block';
                }
            }
        }
    }
    
    setupPauseMenuListeners() {
        document.getElementById('resumeOption').addEventListener('click', () => {
            this.togglePause();
        });
    
        document.getElementById('exitOption').addEventListener('click', () => {
            window.location.href = 'tv.html';
        });
    }
    activateLetterbox(duration = 5000) { // Duration in milliseconds, default 5 seconds
        if (!this.letterboxActive) {
            this.letterboxActive = true;
            
            // Animate the letterbox elements
            if (this.letterboxElements) {
                this.letterboxElements.top.style.height = `${this.letterboxHeight}px`;
                this.letterboxElements.bottom.style.height = `${this.letterboxHeight}px`;
            }
    
            // Set a timeout to deactivate after the specified duration
            setTimeout(() => {
                this.deactivateLetterbox();
            }, duration);
        }
    }
    
    deactivateLetterbox() {
        if (this.letterboxActive) {
            this.letterboxActive = false;
            
            // Animate the letterbox elements back
            if (this.letterboxElements) {
                this.letterboxElements.top.style.height = '0px';
                this.letterboxElements.bottom.style.height = '0px';
            }
        }
    }
    initializeAssets() {
        // Set up error handlers for all background images
        this.gameAssets.background.initialImage.onerror = () => console.error('Error loading initial background');
        this.gameAssets.background.updatedImage.onerror = () => console.error('Error loading updated background');

        this.overlayImages.forEach(overlay => {
            const img = new Image();
            img.src = overlay.src;
            img.onerror = () => console.error(`Error loading overlay: ${overlay.id}`);
            this.gameAssets.overlays.set(overlay.id, {
                ...overlay,
                image: img
            });
        });
    
        // Log to help debug
        console.log('Assets initialized:', this.gameAssets.background.currentImage?.src);
    }

    resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.width = '100%';
        canvas.style.height = '100%';

        this.dots.forEach(dot => {
            const currentLeft = parseFloat(dot.style.left);
            const currentTop = parseFloat(dot.style.top);
            if (currentTop > window.innerHeight) {
                dot.style.top = `${window.innerHeight - 10}px`;
            }
        });
    }

    handleKeyDown(e) {
        if (e.key.toLowerCase() === 'p') {
            this.togglePause();
            return;
        }
        
        if (!this.paused && e.key.toLowerCase() in this.keys) {
            this.keys[e.key.toLowerCase()] = true;
        }
    }

    handleKeyUp(e) {
        if (e.key.toLowerCase() in this.keys) {
            this.keys[e.key.toLowerCase()] = false;
        }
    }

// Modified handleMouseMove function for Game class
handleMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const hoverText = document.querySelector('.hover-text');
    
    // Check rectangles first
    const rectangles = {
        'yellowRectangle': 'Telephone',
        'pinkRectangle': 'Trinket',
        'greenRectangle': 'Fridge',
        'blueRectangle': 'Tissue',
        'purpleRectangle': 'Picture',
        'orangeRectangle': 'Picture'
    };

    let isOverElement = false;

    // Check rectangles - fixed positioning
    for (const [id, text] of Object.entries(rectangles)) {
        const element = document.getElementById(id);
        if (element) {
            const rectBounds = element.getBoundingClientRect();
            if (mouseX >= rectBounds.left - rect.left && 
                mouseX <= rectBounds.right - rect.left && 
                mouseY >= rectBounds.top - rect.top && 
                mouseY <= rectBounds.bottom - rect.top) {
                    hoverText.textContent = text;
                    hoverText.style.display = 'block';
                    hoverText.style.left = `${e.clientX + 20}px`;
                    hoverText.style.top = `${e.clientY - 20}px`;
                    canvas.style.cursor = 'pointer';
                    isOverElement = true;
                    break;
            }
        }
    }

    // If not over rectangles, check circles
    if (!isOverElement) {
        const circlePositions = this.getCirclePosition();
        for (const circlePos of circlePositions) {
            const distance = Math.sqrt(
                Math.pow(mouseX - circlePos.x, 2) + 
                Math.pow(mouseY - circlePos.y, 2)
            );

            if (distance <= circlePos.radius) {
                hoverText.textContent = 'ball';
                hoverText.style.display = 'block';
                hoverText.style.left = `${e.clientX + 20}px`;
                hoverText.style.top = `${e.clientY - 20}px`;
                canvas.style.cursor = 'pointer';
                isOverElement = true;
                break;
            }
        }
    }

    // If not over any element, hide the text
    if (!isOverElement) {
        hoverText.style.display = 'none';
        canvas.style.cursor = 'default';
    }
}

    handleClick(e) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
    
        const circlePositions = this.getCirclePosition();
        
        // Use the same showDialog() for all circles
        for (const circlePos of circlePositions) {
            const distance = Math.sqrt(
                Math.pow(mouseX - circlePos.x, 2) + 
                Math.pow(mouseY - circlePos.y, 2)
            );
    
            if (distance <= circlePos.radius) {
                dialogBox.style.display = 'block';
                window.showDialog(); // Use the same showDialog function for all circles
                break;
            }
        }
        const yellowRect = document.getElementById('yellowRectangle');
        const rectBounds = yellowRect.getBoundingClientRect();
        if (e.clientX >= rectBounds.left && 
            e.clientX <= rectBounds.right && 
            e.clientY >= rectBounds.top && 
            e.clientY <= rectBounds.bottom) {
            window.showDialog2();
        }

        const pinkRect = document.getElementById('pinkRectangle');
        const rectBounds2 = pinkRect.getBoundingClientRect();
        if (e.clientX >= rectBounds2.left && 
            e.clientX <= rectBounds2.right && 
            e.clientY >= rectBounds2.top && 
            e.clientY <= rectBounds2.bottom) {
            window.showDialog3();
        }

        const greenRect = document.getElementById('greenRectangle');
        const rectBounds3 = greenRect.getBoundingClientRect();
        if (e.clientX >= rectBounds3.left && 
            e.clientX <= rectBounds3.right && 
            e.clientY >= rectBounds3.top && 
            e.clientY <= rectBounds3.bottom) {
            window.showDialog4();
        }

        const blueRect = document.getElementById('blueRectangle');
        const rectBounds4 = blueRect.getBoundingClientRect();
        if (e.clientX >= rectBounds4.left && 
            e.clientX <= rectBounds4.right && 
            e.clientY >= rectBounds4.top && 
            e.clientY <= rectBounds4.bottom) {
            window.showDialog5();
        }

        const purpleRect = document.getElementById('purpleRectangle');
        const rectBounds5 = purpleRect.getBoundingClientRect();
        if (e.clientX >= rectBounds5.left && 
            e.clientX <= rectBounds5.right && 
            e.clientY >= rectBounds5.top && 
            e.clientY <= rectBounds5.bottom) {
            window.showDialog6();
        }

        const orangeRect = document.getElementById('orangeRectangle');
        const rectBounds6 = orangeRect.getBoundingClientRect();
        if (e.clientX >= rectBounds6.left && 
            e.clientX <= rectBounds6.right && 
            e.clientY >= rectBounds6.top && 
            e.clientY <= rectBounds6.bottom) {
            window.showDialog7();
        }
        
    }

    getCirclePosition() {
        return CIRCLE_POSITIONS.map(pos => ({
            x: canvas.width * pos.xPercent,
            y: canvas.height * pos.yPercent,
            radius: pos.radius
        }));
    }

    applyCRTEffect(ctx) {
        ctx.globalCompositeOperation = 'screen';
        ctx.filter = 'brightness(1.1) contrast(1.1) saturate(1.3)';
        ctx.shadowColor = 'rgba(0, 255, 0, 0.125)';
        ctx.shadowBlur = 1;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 0;
    }

    updateBattery() {
        const currentTime = Date.now();
        const minutesPassed = Math.floor((currentTime - this.gameStartTime) / (120 * 1000));
        const newBatteryLevel = BATTERY_CONFIG.segments - minutesPassed;
        
        if (newBatteryLevel !== this.batteryLevel) {
            const oldLevel = this.batteryLevel;
            this.batteryLevel = Math.max(0, newBatteryLevel);
            
            // Trigger flicker effect and dialog when transitioning to 3 segments
            if (oldLevel > 3 && this.batteryLevel <= 3) {
                this.screenEffects?.triggerFlicker()
                    .then(() => {
                        if (dialogManager) {
                            dialogManager.showDialog([
                                "You have to hurry",
                                "Before the battery runs out"
                            ], {
                                position: {
                                    bottom: '77vh',
                                    left: '20%',
                                    transform: 'translateX(-50%)'
                                }
                            });
                        }
                    })
                    .catch(err => console.error('Error triggering flicker:', err));
            }
            
            // Add battery death sequence when battery reaches 0
            if (this.batteryLevel === 0) {
                this.paused = true;
                this.batteryDeath.show();
            }
        }
    }

    drawBattery() {
        const container = document.getElementById('battery-container');
        if (!container) return;
    
        // Position the battery container
        container.style.position = 'absolute';
        container.style.left = `${BATTERY_CONFIG.x}px`;
        container.style.bottom = '40px';
        container.style.width = `${BATTERY_CONFIG.width + BATTERY_CONFIG.terminalWidth}px`;
        container.style.height = `${BATTERY_CONFIG.height}px`;
    
        // Clear previous battery
        container.innerHTML = '';
    
        // Create battery body
        const batteryBody = document.createElement('div');
        batteryBody.style.cssText = `
            position: absolute;
            left: 0;
            width: ${BATTERY_CONFIG.width}px;
            height: ${BATTERY_CONFIG.height}px;
            border: ${BATTERY_CONFIG.borderWidth}px solid rgba(104, 115, 81, 1);
        `;
    
        // Create battery terminal
        const terminal = document.createElement('div');
        terminal.style.cssText = `
            position: absolute;
            left: ${BATTERY_CONFIG.width}px;
            top: ${(BATTERY_CONFIG.height - BATTERY_CONFIG.terminalHeight) / 2}px;
            width: ${BATTERY_CONFIG.terminalWidth}px;
            height: ${BATTERY_CONFIG.terminalHeight}px;
            background-color: #697351;
        `;
    
        // Create and add battery segments
        const segmentWidth = (BATTERY_CONFIG.width - (BATTERY_CONFIG.segments + 1) * BATTERY_CONFIG.segmentGap) / BATTERY_CONFIG.segments;
        const segmentHeight = BATTERY_CONFIG.height - 2 * BATTERY_CONFIG.segmentGap;
        const leftOffset = 1;
        const topOffset = 1;
        
        for (let i = 0; i < this.batteryLevel; i++) {
            const segment = document.createElement('div');
            segment.style.cssText = `
                position: absolute;
                left: ${BATTERY_CONFIG.segmentGap + i * (segmentWidth + BATTERY_CONFIG.segmentGap) - leftOffset}px;
                top: ${BATTERY_CONFIG.segmentGap - topOffset}px;
                width: ${segmentWidth}px;
                height: ${segmentHeight}px;
                background-color: rgba(154, 179, 29, 0.8);
            `;
            batteryBody.appendChild(segment);
        }
    
        // Add all elements to container
        batteryBody.appendChild(terminal);
        container.appendChild(batteryBody);
    }

    drawSquares() {
        const container = document.getElementById('squares-container');
        if (!container) return;
    
        // Only create squares if they don't exist
        if (!container.children.length) {
            const squareSize = 60;
            const gap = 20;
            const totalWidth = (squareSize * 4) + (gap * 3);
            
            container.style.cssText = `
                position: absolute;
                left: 51.5%;
                bottom: 25px;
                width: ${totalWidth}px;
                height: ${squareSize}px;
                transform: translateX(-50%);
                display: flex;
                gap: ${gap}px;
                z-index: 6;
            `;
    
            // Create four squares
            for (let i = 0; i < 4; i++) {
                const square = document.createElement('div');
                square.style.cssText = `
                    position: relative;
                    width: ${squareSize}px;
                    height: ${squareSize}px;
                    background-color: rgba(47, 62, 60, 0.2);
                    border: 2px solid rgba(137, 145, 124, 0.8);
                    border-radius: 13px;
                `;
                container.appendChild(square);
            }
        }
    }

    drawGame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.applyCRTEffect(ctx);
    
        
        // Handle background state
        if (this.backgroundState.currentState === 'animation') {
            const currentTime = Date.now();
            if (currentTime - this.lastFrameTime > this.frameDuration) {
                this.currentFrame = (this.currentFrame + 1) % this.frameCount;
                this.lastFrameTime = currentTime;
            }
            
            if (this.animationFrames[this.currentFrame]?.complete) {
                ctx.drawImage(
                    this.animationFrames[this.currentFrame],
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
            }
        } else {
            if (this.gameAssets.background.currentImage?.complete) {
                ctx.drawImage(
                    this.gameAssets.background.currentImage,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
            }
        }
    
        // Draw the static overlay after the background
    
        // Draw the rest of the game elements
        this.imageOverlay.draw();
        const circlePositions = this.getCirclePosition();
        for (const circlePos of circlePositions) {
            ctx.beginPath();
            ctx.arc(circlePos.x, circlePos.y, circlePos.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 0, 0, 0.0)';
            ctx.fill();
            ctx.closePath();
        }
    
        ctx.globalCompositeOperation = 'source-over';
        ctx.filter = 'none';
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        this.staticOverlay.draw(ctx);

    }

    gameLoop() {
        if (!this.paused) {
            // Check win condition before any other updates
            this.checkWinCondition();
    
            // Only process regular game updates if win sequence hasn't started
            if (!this.hasWon) {
                if (this.backgroundState.currentState === 'animation') {
                    const currentTime = Date.now();
                    if (currentTime - this.lastFrameTime > this.frameDuration) {
                        this.currentFrame = (this.currentFrame + 1) % this.frameCount;
                        this.lastFrameTime = currentTime;
                        
                        if (this.currentFrame === this.frameCount - 1) {
                            setTimeout(() => {
                                this.switchBackground('final');
                            }, this.frameDuration);
                        }
                    }
                }
            
                this.drawGame();
                this.updateBattery();
                this.drawBattery();
                this.drawSquares();
            } else {
                // If win sequence is active, only draw the game (to maintain background)
                this.drawGame();
                
                // Handle fade transition if active
                if (this.fadeStartTime) {
                    const fadeProgress = (Date.now() - this.fadeStartTime) / this.fadeDuration;
                    if (fadeProgress <= 1) {
                        // Update fade overlay opacity if needed
                        if (this.fadeOverlay && !this.fadeOverlay.style.opacity) {
                            this.fadeOverlay.style.opacity = fadeProgress.toString();
                        }
                    }
                }
            }
        }
        
        requestAnimationFrame(this.gameLoop);
    }
}
const game = new Game();
export { game };