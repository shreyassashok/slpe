document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.querySelector("#gameCanvas");
    const ctx = canvas.getContext("2d");
    const gridSize = 6;
    const cellSize = 400 / gridSize;
    let points = [];
    let animations = [];
    let slopes = new Set(); // Set to keep track of slopes

    // Event Listeners
    canvas.addEventListener("click", handleCanvasClick);
    document.querySelector(".start-button").addEventListener("click", startGame);
    document.querySelector(".reset-button").addEventListener("click", resetGame);

    function handleCanvasClick(event) {
        const clickedPoint = getClickedPoint(event);

        if (isPointValid(clickedPoint)) {
            for (let existingPoint of points) {
                const slope = calculateSlope(clickedPoint, existingPoint);
                slopes.add(slope);
            }
            points.push(clickedPoint);
            animations.push({point: clickedPoint, radius: 0});
            animateDot();
        } else {
            alert("Invalid move! Try again.");
        }
    }

    function getClickedPoint(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        return {
            x: Math.floor(x / cellSize),
            y: Math.floor(y / cellSize)
        };
    }

    function isPointValid(newPoint) {
        // Check if point is in the same row or column as any existing point
        if (points.some(p => p.x === newPoint.x || p.y === newPoint.y)) return false;

        for (let existingPoint of points) {
            const slope = calculateSlope(newPoint, existingPoint);
            if (slopes.has(slope)) {
                return false;
            }
        }
        return true;
    }

    function calculateSlope(p1, p2) {
        if (p2.x === p1.x) return Infinity;
        return (p2.y - p1.y) / (p2.x - p1.x);
    }

    function animateDot() {
        let animationFinished = true;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGridLines();

        for (let animation of animations) {
            if (animation.radius < cellSize / 3) {
                animation.radius += cellSize / 30;
                animationFinished = false;
            }

            ctx.beginPath();
            ctx.arc((animation.point.x + 0.5) * cellSize, (animation.point.y + 0.5) * cellSize, animation.radius, 0, Math.PI * 2);
            ctx.fillStyle = "#FF3000";
            ctx.fill();
        }

        drawPoints();

        if (!animationFinished) {
            requestAnimationFrame(animateDot);
        }
    }

    function drawGame() {
        clearCanvas();
        drawGridLines();
        drawPoints();
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function drawGridLines() {
        for (let i = 1; i < gridSize; i++) {
            ctx.beginPath();
            ctx.moveTo(i * cellSize, 0);
            ctx.lineTo(i * cellSize, canvas.height);
            ctx.moveTo(0, i * cellSize);
            ctx.lineTo(canvas.width, i * cellSize);
            ctx.stroke();
        }
    }

    function drawPoints() {
        for (const point of points) {
            if (!animations.some(a => a.point === point)) {
                ctx.beginPath();
                ctx.arc((point.x + 0.5) * cellSize, (point.y + 0.5) * cellSize, cellSize / 3, 0, Math.PI * 2);
                ctx.fillStyle = "#FF3000";
                ctx.fill();
            }
        }
    }

    function startGame() {
        points = [];
        animations = [];
        slopes.clear(); // Clear the set of slopes
        drawGame();
        updateMessage("Game has started! Click on the grid to place your points.");
    }

    function resetGame() {
        points = [];
        animations = [];
        slopes.clear(); // Clear the set of slopes
        drawGame();
        updateMessage("Game has been reset.");
    }

    function updateMessage(message) {
        document.querySelector(".message").textContent = message;
    }

    startGame();
});