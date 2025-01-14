// Got rid of sprite for player
export const obstacles = [
    {
        x: 100, // green
        y: 100,
        width: 1280,
        height: 150,
        color: 'rgba(47, 62, 60, 0.0)', // Semi-transparent gray
        border: 'rgba(0, 128, 0, 0.0)' // Border color matching game style
    },
    {
        x: 0, //red
        y: 135,
        width: 500,
        height: 300,
        color: 'rgba(47, 62, 60, 0.0)',
        border: 'rgba(255, 0, 0, 0.0)'
    },
    {
        x: 865, //yellow
        y: 410,
        width: 500,
        height: 500,
        color: 'rgba(47, 62, 60, 0.0)',
        border: 'rgba(255, 255, 0, 0.0)'
    },
    {
        x: 1000, // white
        y: 200,
        width: 300,
        height: 100,
        color: 'rgba(47, 62, 60, 0.0)',
        border: 'rgba(255, 255, 255, 0.0)'
    }
];

// Check if two rectangles intersect
export function checkCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

// Draw obstacles on the canvas
export function drawObstacles(ctx) {
    obstacles.forEach(obstacle => {
        ctx.fillStyle = obstacle.color;
        ctx.strokeStyle = obstacle.border;
        ctx.lineWidth = 2;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}