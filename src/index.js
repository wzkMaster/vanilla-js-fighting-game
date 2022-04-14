import { decreaseTimer, rectangularCollision } from "./js/utils";
import { Sprite, Fighter } from "./js/classes";
import "./css/style.css";
import backgroundImg from "./images/background.png";
import shopImg from "./images/shop.png";
import samuraiIdle from "./images/samuraiMack/Idle.png";
import samuraiRun from "./images/samuraiMack/Run.png";
import samuraiJump from "./images/samuraiMack/Jump.png";
import samuraiFall from "./images/samuraiMack/Fall.png";
import samuraiAttack1 from "./images/samuraiMack/Attack1.png";
import samuraiAttack2 from "./images/samuraiMack/Attack2.png";
import samuraiTakeHit from "./images/samuraiMack/Take-Hit.png";
import samuraiDeath from "./images/samuraiMack/Death.png";
import kenjiIdle from "./images/kenji/Idle.png";
import kenjiRun from "./images/kenji/Run.png";
import kenjiJump from "./images/kenji/Jump.png";
import kenjiFall from "./images/kenji/Fall.png";
import kenjiAttack1 from "./images/kenji/Attack1.png";
import kenjiAttack2 from "./images/kenji/Attack2.png";
import kenjiDeath from "./images/kenji/Death.png";
import kenjiTakeHit from "./images/kenji/Take-Hit.png";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 576;
c.fillRect(0, 0, canvas.width, canvas.height);

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: backgroundImg,
  context: c,
});

const shop = new Sprite({
  position: {
    x: 600,
    y: 160,
  },
  imageSrc: shopImg,
  scale: 2.5,
  framesMax: 6,
  context: c,
});

const player = new Fighter({
  position: {
    x: 0,
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
  imageSrc: samuraiIdle,
  framesMax: 8,
  scale: 2.5,
  sprites: {
    idle: {
      imageSrc: samuraiIdle,
      framesMax: 8,
    },
    run: {
      imageSrc: samuraiRun,
      framesMax: 8,
    },
    jump: {
      imageSrc: samuraiJump,
      framesMax: 2,
    },
    fall: {
      imageSrc: samuraiFall,
      framesMax: 2,
    },
    attack1: {
      imageSrc: samuraiAttack1,
      framesMax: 6,
    },
    takeHit: {
      imageSrc: samuraiTakeHit,
      framesMax: 4,
    },
    death: {
      imageSrc: samuraiDeath,
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
  context: c,
});
const enemy = new Fighter({
  position: {
    x: canvas.width - 50,
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
  imageSrc: kenjiIdle,
  framesMax: 4,
  scale: 2.5,
  sprites: {
    idle: {
      imageSrc: kenjiIdle,
      framesMax: 4,
    },
    run: {
      imageSrc: kenjiRun,
      framesMax: 8,
    },
    jump: {
      imageSrc: kenjiJump,
      framesMax: 2,
    },
    fall: {
      imageSrc: kenjiFall,
      framesMax: 2,
    },
    attack1: {
      imageSrc: kenjiAttack1,
      framesMax: 4,
    },
    takeHit: {
      imageSrc: kenjiTakeHit,
      framesMax: 3,
    },
    death: {
      imageSrc: kenjiDeath,
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
  context: c,
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

decreaseTimer(player, enemy);

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

  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
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

  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -7.5;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
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
    enemy.takeHit(12.5);
    player.isAttacking = false;
    gsap.to("#enemyHealth", {
      width: `${enemy.health}%`,
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
    player.takeHit(6.25);
    enemy.isAttacking = false;
    gsap.to("#playerHealth", {
      width: `${player.health}%`,
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
      case " ":
        player.attack();
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
      case "ArrowDown":
        enemy.attack();
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
