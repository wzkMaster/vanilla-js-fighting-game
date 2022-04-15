const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./images/background.png",
});

const shop = new Sprite({
  position: {
    x: 600,
    y: 160,
  },
  imageSrc: "./images/shop.png",
  scale: 2.5,
  framesMax: 6,
});

const attack = {
  player: [10, 15],
  enemy: [5, 7.5],
};

const player = new Fighter({
  position: {
    x: 100,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 1,
  },
  offset: {
    x: 215,
    y: 160,
  },
  imageSrc: "./images/samuraiMack/Idle.png",
  framesMax: 8,
  scale: 2.5,
  sprites: {
    idle: {
      imageSrc: "./images/samuraiMack/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./images/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./images/samuraiMack/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./images/samuraiMack/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./images/samuraiMack/Attack1.png",
      framesMax: 6,
    },
    attack2: {
      imageSrc: "./images/samuraiMack/Attack2.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "./images/samuraiMack/Take-Hit.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "./images/samuraiMack/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 75,
      y: 25,
    },
    width: 160,
    height: 75,
  },
});
const enemy = new Fighter({
  position: {
    x: canvas.width - 100,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 1,
  },
  offset: {
    x: 215,
    y: 167,
  },
  imageSrc: "./images/kenji/Idle.png",
  framesMax: 4,
  scale: 2.5,
  sprites: {
    idle: {
      imageSrc: "./images/kenji/Idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "./images/kenji/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./images/kenji/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./images/kenji/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./images/kenji/Attack1.png",
      framesMax: 4,
    },
    attack2: {
      imageSrc: "./images/kenji/Attack2.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "./images/kenji/Take-hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./images/kenji/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -160,
      y: 25,
    },
    width: 160,
    height: 75,
  },
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  if (player.health === enemy.health) {
    document.querySelector("#displayText").innerHTML = "Tie";
  } else if (player.health > enemy.health) {
    document.querySelector("#displayText").innerHTML = "Player 1 Wins";
  } else {
    document.querySelector("#displayText").innerHTML = "Player 2 Wins";
  }
  document.querySelector("#displayText").style.display = "flex";
}

let timer = 60;
let timerId;

decreaseTimer();

function animate() {
  requestAnimationFrame(animate);

  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  c.fillStyle = "rgba(255, 255, 255, 0.15)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  if (keys.a.pressed && player.lastKey === "a" && player.position.x > 0) {
    player.reverse = true;
    player.velocity.x = -5;
    player.switchSprite("run");
  } else if (
    keys.d.pressed &&
    player.lastKey === "d" &&
    player.position.x + player.width < canvas.width
  ) {
    player.reverse = false;
    player.velocity.x = 5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }
  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }
  if (
    keys.ArrowLeft.pressed &&
    enemy.lastKey === "ArrowLeft" &&
    enemy.position.x > 0
  ) {
    enemy.reverse = false;
    enemy.velocity.x = -7.5;
    enemy.switchSprite("run");
  } else if (
    keys.ArrowRight.pressed &&
    enemy.lastKey === "ArrowRight" &&
    enemy.position.x + enemy.width < canvas.width
  ) {
    enemy.reverse = true;
    enemy.velocity.x = 7.5;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }
  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    enemy.takeHit(attack.player[player.isAttacking - 1]);
    player.isAttacking = false;
    gsap.to("#enemyHealth", {
      width: `${enemy.health > 0 ? enemy.health : 0}%`,
    });
  }

  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }

  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking
  ) {
    player.takeHit(attack.enemy[enemy.isAttacking - 1]);
    enemy.isAttacking = false;
    gsap.to("#playerHealth", {
      width: `${player.health > 0 ? player.health : 0}%`,
    });
  }

  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;
  }

  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({
      player,
      enemy,
      timerId,
    });
  }
}

animate();

window.addEventListener("keydown", (event) => {
  if (!player.dead) {
    switch (event.key) {
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
      case "a":
        keys.a.pressed = true;
        player.lastKey = "a";
        break;
      case "w":
        if (player.velocity.y === 0) {
          player.velocity.y = -20;
        }
        break;
      case "g":
        player.attack(1);
        break;
      case "h":
        player.attack(2);
        break;
    }
  }
  if (!enemy.dead) {
    switch (event.key) {
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;
      case "ArrowUp":
        if (enemy.velocity.y === 0) {
          enemy.velocity.y = -20;
        }
        break;
      case "k":
        enemy.attack(1);
        break;
      case "l":
        enemy.attack(2);
        break;
    }
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
  }
});
