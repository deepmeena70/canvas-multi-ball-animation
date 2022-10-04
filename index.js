const canvas = document.getElementById("canvas");

canvas.width = innerWidth;
canvas.height = innerHeight;

const ctx = canvas.getContext("2d");

const config = document.getElementById("config");
const play = document.getElementById("play");

let raf;

const initial = {
  x: 50,
  y: 50,
  r: 50,
  vX: 15,
  vY: 2.5,
  color: "green",
};

class Ball {
  x;
  y;
  vX;
  vY;
  r;
  minR = 10;
  color;
  marginX = 50;
  marginY = 50;
  directionY = false;
  hitTimes = 0;
  explode = false;

  constructor(x, y, r, vX, vY, color) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.vX = vX;
    this.vY = vY;
    this.color = color;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

const startAnimation = () => {
  const ball = new Ball(
    initial.x,
    initial.y,
    initial.r,
    initial.vX,
    initial.vY,
    initial.color
  );

  let balls = [];

  const animate = () => {
    // clear previous canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ball.color = "#" + (((1 << 24) * Math.random()) | 0).toString(16);
  
    // gravitational effect
  
    if (ball.hitTimes > 14) {
      ball.vY *= 0.0094; // decelerate after 15 hits in y
      ball.vX *= 0.9921; //decelerate after 15 hits in x
    } else {
      ball.vY *= 0.99; //decelerate
      ball.vY += 0.399; //pull
      ball.vX *= 0.999; //decelerate
    }
  
    if (
      ball.y + ball.vY > canvas.height - (initial.y - 2) ||
      ball.y + ball.vY < initial.y
    ) {
      ball.vY = -ball.vY;
      if (!ball.directionY) {
        ball.hitTimes++;
        ball.directionY = true;
      } else {
        ball.directionY = false;
      }
    }
  
    if (
      ball.x + ball.vX > canvas.width - initial.x ||
      ball.x + ball.vX < initial.x
    ) {
      ball.vX = -ball.vX;
    }
  
    ball.y += ball.vY;
    ball.x += ball.vX;
  
    // draw the ball
    ball.draw();
  
    // filling balls
  
    if (!ball.explode && ball.hitTimes === 1) {
      for (let i = 0; i < 40; i++) {
        balls.push(
          new Ball(
            ball.x,
            ball.y,
            ball.r*0.2,
            ball.vX * (Math.random() + 0.124),
            ball.vY * (Math.random() + 0.0024),
            "#" + (((1 << 24) * Math.random()) | 0).toString(16)
          )
        );
      }
      ball.explode = true;
    }
  
    // balls explosion
    balls.forEach((b) => {
      if (
        b.y + b.vY > canvas.height - (initial.y - 3.8*b.r) ||
        b.y + b.vY < initial.y
      ) {
        b.vY = -b.vY;
        if (!b.directionY) {
          b.hitTimes++;
          b.directionY = true;
        } else {
          b.directionY = false;
        }
      }
  
      if (b.y > canvas.height) {
        b.hitTimes++;
      }
  
      if (b.x + b.vX > canvas.width - initial.x || b.x + b.vX < initial.x) {
        b.vX = -b.vX;
      }
  
      if (b.hitTimes > 14) {
        b.vY *= 0.009; // decelerate after  14 hits in y
        b.vX *= 0.9921; //decelerate after 14 hits in x
      } else {
        b.vY *= 0.999; //decelerate in y direction
        b.vY += 0.289; //pull
        b.vX *= 0.999; //decelerate in x direction
      }
  
      b.y += b.vY;
      b.x += b.vX;
      b.draw();
    });
  
    // configuration details
    config.innerHTML = `<div>
    <div style="text-transform:uppercase; padding:.4em 0 .4em 0;">Main Ball Configurations</div>
    <div>x : ${ball.x}</div>
    <div>y : ${ball.y}</div>
    <div>vX : ${ball.vX}</div>
    <div>vY : ${ball.vY}</div>
    <div>Direction: ${!ball.directionY ? "👇" : "👆"}</div>
    <div>Hit: ${ball.hitTimes}</div>
    <div>No. of exploded balls: ${balls.length}</div>
    </div>`;
  
    raf = requestAnimationFrame(animate);
  };

  animate();
}

play.addEventListener("click", () => {
  if (!raf) {
    play.innerHTML = 'STOP ‼️'
    startAnimation();
  } else {
    play.innerHTML = 'PLAY 👇😎'
    cancelAnimationFrame(raf);
    raf = undefined;
  }
});

onresize = () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
};
