
export const CIRCLE_POSITION = {
    xPercent: 0.35,
    yPercent: 0.72,
    radius: 15
};

export const RECTANGLE_POSITION = {
    x: 500,
    y: 300,
    width: 50,
    height: 50,
    interactionDistance: 150
};

export class InteractionManager {
    constructor(canvas, dialogManager) {  // Add parameters
        this.canvas = canvas;  // Store the canvas reference
        this.ctx = canvas.getContext('2d');  // Now this will work
        this.dialogManager = dialogManager;
        this.ballText = document.querySelector('.ball-text');
        this.dialogBox = document.getElementById('dialogBox');
        this.keyImage = {
            element: null,
            visible: false
        };

        // Bind methods
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleRectangleClick = this.handleRectangleClick.bind(this);
    }

    initialize(player) {
        this.player = player;
        this.canvas.addEventListener('mousemove', this.handleMouseMove);
        this.canvas.addEventListener('click', this.handleClick);
        this.canvas.addEventListener('click', this.handleRectangleClick);
    }

    getCirclePosition() {
        return {
            x: this.canvas.width * CIRCLE_POSITION.xPercent,
            y: this.canvas.height * CIRCLE_POSITION.yPercent,
            radius: CIRCLE_POSITION.radius
        };
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const circlePos = this.getCirclePosition();
        const distance = Math.sqrt(
            Math.pow(mouseX - circlePos.x, 2) + 
            Math.pow(mouseY - circlePos.y, 2)
        );

        const isOverCircle = distance <= circlePos.radius;

        if (isOverCircle) {
            this.ballText.style.display = 'block';
            this.ballText.style.left = `${circlePos.x + 20}px`;
            this.ballText.style.top = `${circlePos.y - 50}px`;
            this.canvas.style.cursor = 'pointer';
        } else {
            this.ballText.style.display = 'none';
            this.canvas.style.cursor = 'default';
        }
    }

    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const circlePos = this.getCirclePosition();
        const distance = Math.sqrt(
            Math.pow(mouseX - circlePos.x, 2) + 
            Math.pow(mouseY - circlePos.y, 2)
        );

        if (distance <= circlePos.radius) {
            this.dialogBox.style.display = 'block';
            window.showDialog();
        }
    }

    handleRectangleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        if (mouseX >= RECTANGLE_POSITION.x && 
            mouseX <= RECTANGLE_POSITION.x + RECTANGLE_POSITION.width &&
            mouseY >= RECTANGLE_POSITION.y && 
            mouseY <= RECTANGLE_POSITION.y + RECTANGLE_POSITION.height) {
            
            const distance = Math.sqrt(
                Math.pow(this.player.x + this.player.width/2 - RECTANGLE_POSITION.x, 2) +
                Math.pow(this.player.y + this.player.height/2 - RECTANGLE_POSITION.y, 2)
            );

            if (distance <= RECTANGLE_POSITION.interactionDistance) {
                this.showKeyImage();
            }
        }
    }

    showKeyImage() {
        if (!this.keyImage.element) {
            const container = document.createElement('div');
            container.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.8);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            `;

            const img = document.createElement('img');
            img.src = './assets/key.png';
            img.style.cssText = `
                max-width: 90%;
                max-height: 80%;
                object-fit: contain;
            `;

            const exitButton = document.createElement('button');
            exitButton.textContent = 'Exit';
            exitButton.style.cssText = `
                margin-top: 20px;
                padding: 10px 20px;
                background-color: #c2c3b2;
                border: none;
                cursor: pointer;
                font-family: 'PixelOperatorMono';
                font-size: 1.2rem;
            `;
            exitButton.onclick = () => this.hideKeyImage();

            container.appendChild(img);
            container.appendChild(exitButton);
            document.body.appendChild(container);
            this.keyImage.element = container;
        }
        this.keyImage.element.style.display = 'flex';
        this.keyImage.visible = true;
    }

    hideKeyImage() {
        if (this.keyImage.element) {
            this.keyImage.element.style.display = 'none';
            this.keyImage.visible = false;
        }
    }

    drawInteractions() {
        // Draw circle
        const circlePos = this.getCirclePosition();
        this.ctx.beginPath();
        this.ctx.arc(circlePos.x, circlePos.y, circlePos.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(255, 0, 0, 1.0)';
        this.ctx.fill();
        this.ctx.closePath();

        // Draw rectangle
        this.ctx.fillStyle = 'rgb(255, 0, 0)';
        this.ctx.fillRect(
            RECTANGLE_POSITION.x,
            RECTANGLE_POSITION.y,
            RECTANGLE_POSITION.width,
            RECTANGLE_POSITION.height
        );
    }
}