const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const score = document.querySelector(".score--value")
const finalScore = document.querySelector(".final-score > span")
const menu = document.querySelector(".menu-screen")
const buttonPlay = document.querySelector(".btn-play")

const size = 30

const initialPosition = { x: 270, y: 240 }

let snake = [initialPosition]

const incrementScore = () => {
    score.innerText = +score.innerText + 10
}

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}

const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size)
    return Math.round(number / 30) * 30
}

const randomImg = () => {
    const maca = "./imgs/maca.png";
    const banana = "./imgs/banana.png";
    const uva = "./imgs/uva.png";
  
    const fruits = [banana, uva, maca];
    const rand = Math.round(Math.random() * (fruits.length - 1) + 0);
  
    return fruits[rand];
  };

const randomColor = () => {
  const colors = [
    "black",
    "red",
    "white",
    "purple",
    "orange",
    "yellow",
    "green",
  ];

  const rand = Math.round(Math.random() * (colors.length - 1) + 0);

  return colors[rand];
};

const food = {
    x: randomPosition(),
    y: randomPosition(),
    src: randomImg()
}

const bomb = {
  x: randomPosition(),
  y: randomPosition(),
  src: "./imgs/bomba.png",
}; 

let direction, loopId

const drawFood = () => {
    const { x, y, src } = food;

    const image = new Image();
    image.src = src;
    ctx.drawImage(image, x, y, size, size);
}

const drawBomb = () => {
  const { x, y, src } = bomb;

  const image = new Image();
  image.src = src;
  ctx.drawImage(image, x, y, size, size);
};

const drawSnake = () => {
    snake.forEach((position, index) => {        
        ctx.fillRect(position.x, position.y, size, size)
    })
}

const moveSnake = () => {
    if (!direction) return

    const head = snake[snake.length - 1]

    if (direction == "right") {
        snake.push({ x: head.x + size, y: head.y })
    }

    if (direction == "left") {
        snake.push({ x: head.x - size, y: head.y })
    }

    if (direction == "down") {
        snake.push({ x: head.x, y: head.y + size })
    }

    if (direction == "up") {
        snake.push({ x: head.x, y: head.y - size })
    }

    snake.shift()
}

const drawGrid = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = "#191919"

    for (let i = 30; i < canvas.width; i += 30) {
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()
    }
}

const chackEat = () => {
    const head = snake[snake.length - 1]

    if (head.x == food.x && head.y == food.y) {
        incrementScore()
        snake.push(head)
        
    if (food.src == "./imgs/banana.png") {
      ctx.fillStyle = "yellow";
    } else if (food.src == "./imgs/uva.png") {
      ctx.fillStyle = "purple";
    } else {
      ctx.fillStyle = "red";
    }
        
        let x = randomPosition()
        let y = randomPosition()

        while (snake.find((position) => position.x == x && position.y == y)) {
            x = randomPosition()
            y = randomPosition()
        }

        food.x = x
        food.y = y
        food.src = randomImg()
    } 
    
    if (head.x == bomb.x && head.y == bomb.y) {
        gameOver();
    }
}

const checkCollision = () => {
    const head = snake[snake.length - 1]
    const canvasLimit = canvas.width - size
    const neckIndex = snake.length - 2

    const wallCollision =
        head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit

    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y
    })

    if (wallCollision || selfCollision) {
        gameOver()
    }
}

let isGameOver = false;

const gameOver = () => {
  isGameOver = true;
  direction = undefined;
  ctx.fillStyle = randomColor();

  menu.style.display = "flex";
  finalScore.innerText = score.innerText;
  canvas.style.filter = "blur(2px)";
};

const gameLoop = () => {
    clearInterval(loopId)

    ctx.clearRect(0, 0, 600, 600)
    drawGrid()
    drawFood()
    drawBomb()
    moveSnake()
    drawSnake()
    chackEat()
    checkCollision()

    loopId = setTimeout(() => {
        gameLoop()
    }, 100)
}

gameLoop()

document.addEventListener("keydown", ({ key }) => {
    if (key == "ArrowRight" && direction != "left") {
        direction = "right"
    }

    if (key == "ArrowLeft" && direction != "right") {
        direction = "left"
    }

    if (key == "ArrowDown" && direction != "up") {
        direction = "down"
    }

    if (key == "ArrowUp" && direction != "down") {
        direction = "up"
    }
})

buttonPlay.addEventListener("click", () => {
    score.innerText = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"

    snake = [initialPosition]
})
