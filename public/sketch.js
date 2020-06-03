let mushrooms;
let bullets;
let enemies;

let headImage;
let rhinoImage;
let gunImage;
let bulletImage;
let platoImage;

let mush;
let enemy;
let shipHead;
let gun;
let blood;

let acceleration;

let lifeScore = 100;
let mushroomsScore = 0;
let bulletsScore = 0;

let gameState = 'start';
let currMoment = 0;

let rhinoSpeed = 2;
let rhinoAccel = 0.1;

let stars;

let pixFont;
let regFont;

let stateChanged = true; // NEW

function preload() {
  headImage = loadImage('assets/boris.png');
  rhinoImage = loadImage('assets/rhinoceros.png');
  mushroomImage = loadImage('assets/mushroom.png');
  gunImage = loadImage('assets/gun.png');
  platoImage = loadImage('assets/plato.png');
  bulletImage = loadImage('assets/bullet.png');

  pixFont = loadFont('assets/BungeeShade-Regular.ttf'); // BungeeShade-Regular, PressStart2P-Regular, PaytoneOne-Regular, Jost.ttf
  regFont = loadFont('assets/Jost.ttf');
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(40);
  textAlign(CENTER, CENTER);

  stars = new StarSystem(createVector(width / 2, 50));
}

function draw() {
  if (gameState == 'start') {
    startGame();
  }
  else if(gameState == 'draw') {
    clear();
    everything();
  }
  else {
    gameOver();
  }
}

function everything() {
  background(12, 12, 33);
  fill(0);

  renderBlackHole();
  showScores();
  generateStars();

  shipHead.visible = true;
  shipHead.mass = 0.1;
  shipHead.restitution = 5;
  
  if(keyDown(LEFT_ARROW)) {
    shipHead.rotation -= 4;
  }
  
  if(keyDown(RIGHT_ARROW)) {
    shipHead.rotation += 4;
  }
  
  if(keyDown('z') && bulletsScore > 0) {
    generateBullet();
  }
  
  if(keyDown('x')) // keyWentDown 
  {
    shipHead.changeAnimation('thrust');
    
    let gConst = 1;
    let angle = shipHead.rotation;
    
    angle = radians(angle);
    
    let oppKathet = cos(angle) * gConst;
    let nearKathet = sin(angle) * gConst;
    let pointX = shipHead.position.x + oppKathet;
    let pointY = shipHead.position.y + nearKathet;
    
    //acceleration = acceleration + 0.5;
    shipHead.attractionPoint(acceleration, pointX,  pointY);
  }
  else {
    shipHead.changeAnimation('normal');
    shipHead.rotation -= 0.2;
  }
  
  if(keyDown(UP_ARROW)){
    shipHead.position.y -= 2;
  }
  
  if(keyDown(DOWN_ARROW)){
    shipHead.position.y += 2;
  }
  
  shipHead.debug = mouseIsPressed;
  
  shipHead.overlap(mushrooms, collect);
  bullets.overlap(enemies, kill);
  shipHead.bounce(enemies, punish);
    
  drawSprites();
  constrainEdges();
}

function startGame() {
  background(255, 255, 255);

  push();
  noFill();
  strokeWeight(8);
  stroke(12, 12, 75);
  rect(20, 20, width - 40, height - 40);
  pop();

  textFont(pixFont, 56);
  fill(12, 12, 75);
  text( "Press S to start", width/2, height/2 - 100);

  showInstructions();

  if (keyIsPressed && key == 's') {
    gameState = 'draw';
    lifeScore = 100;
    mushroomsScore = 0;
    rhinoSpeed = 2;
    acceleration = 10;
    bulletsScore = 100;

    shipHead = createSprite(width/2, height/2);
    //shipHead.maxSpeed = 6;
    shipHead.friction = 0.3;
    shipHead.addImage('normal', headImage);
    shipHead.addAnimation('thrust', 'assets/boris_0001.png', 'assets/boris_0007.png');
    shipHead.scale = 0.25;
    shipHead.setCollider('rectangle', 0, 0, 550, 200);
    shipHead.visible = false;

    mushrooms = new Group();
    enemies = new Group();
    bullets = new Group();

    setInterval(generateMushrooms, 2000);
    setInterval(generateEnemies, 5000);
  }
}

function gameOver() {
  mushrooms.removeSprites();
  enemies.removeSprites();
  shipHead.remove();

  background(255, 33, 33);
  fill(255, 171, 171);
  textFont(pixFont, 74);
  text("GAME OVER", width/2, height/2 - 150);
  
  fill(255, 205, 205);
  textFont(regFont, 34);
  text("Press R to restart", width/2, height/2 - 50);
  gameState = 'over';

  // NEW 
  if(stateChanged) {
    stateChanged = false;
    showForm();
  }

  if(keyIsPressed && key == 'r') 
  {
    document.location.reload(true); // NEW
  }
}

function constrainEdges() {
  if (shipHead.position.x > width) {
    shipHead.position.x = width - 50;   
  }
  else if (shipHead.position.x < 0) {
    shipHead.position.x =  50;
  }

  if (shipHead.position.y > height) {
    shipHead.position.y = height - 50;  
  }
  else if (shipHead.position.y < 0) {
    if ( (shipHead.position.x > width/2 - 50) && (shipHead.position.x < width/2 + 50) && (shipHead.position.y < 60)) {
      shipHead.velocity.y *= -1;
      shipHead.position.y = height;
      flashLight();
    } 
    else {
      shipHead.position.y =  50;
    }
  } 
}

function renderBlackHole() { 
  fill(159, 8, 0);
  ellipse (width/2, 0, 120);

  fill(0, 0, 0);
  stroke(253, 117, 5);
  strokeWeight(8);
  ellipse (width/2, 0, 100);

  stroke(253, 117, 5);
  strokeWeight(1);
  ellipse (width/2, 0, 70);

  stroke(0, 0, 0);
  strokeWeight(3);
  fill(253, 117, 5);
  ellipse (width/2, 0, 300, 30);

  stroke(0, 0, 0);
  strokeWeight(3);
  fill(159, 8, 0);
  ellipse (width/2, 0, 300, 30);

  stroke(0, 0, 0);
  strokeWeight(3);
  fill(253, 117, 5);
  ellipse (width/2, 0, 280, 20);

}

function showInstructions() {
  fill(45, 55, 205);
  textFont(regFont, 24);
  text("Collect mushrooms, avoid rhinos", width/2, height/2);
  text("You get 1 bullet per 5 mushrooms", width/2, height/2 + 50);
  text("Press 'x' to move w acceleration", width/2, height/2 + 100);
  text("Press 'z' to shoot", width/2, height/2 + 150);
}

function generateMushrooms() {
  mush = createSprite(random(40, height-40), random(40, width-40));
  mush.scale = 0.3;
  mush.maxSpeed = 1;
  mush.setCollider('circle', 0, 0, 20);
  mush.addImage(mushroomImage);
  mush.setSpeed(random(-10, 10), random(0, 270));
  mush.life = 520;
  mushrooms.add(mush);
}

function generateEnemies() {
  enemy = createSprite(random(width-80, width-20), random(50, height-50));
  enemy.scale = 0.2;
  enemy.mass = 10;
  enemy.restitution = 15;
  enemy.maxSpeed = rhinoSpeed;
  enemy.addImage('normal', random([rhinoImage, platoImage]));
  enemy.setSpeed(-rhinoSpeed);

  enemy.setCollider('rectangle', 0, 0, 350, 250);
  enemy.life = 500;
  enemies.add(enemy);

  rhinoSpeed += rhinoAccel;
}

function generateBullet() {
  bullet = createSprite(shipHead.position.x, shipHead.position.y, 3, 3);
  bullet.scale = 0.2;
  bullet.mass = 2;
  bullet.setSpeed(30, shipHead.rotation + 90); // (30, angle);
  bullet.shapeColor = color(255, 200, 0);
  bullet.addImage('normal', bulletImage);
  bullet.life = 20;
  bullet.rotation = shipHead.rotation + 90;
  bullets.add(bullet);
  bulletsScore -= 1;
}

function generateBlood() {
  for (let i = 0; i < 12; i++) {
    blood = createSprite(shipHead.position.x, shipHead.position.y, 4, 4);
    blood.scale = 2;
    blood.setSpeed(7, random(0, 270)); // (30, angle);
    blood.shapeColor = color(255, 0, 0);
    //blood.addImage('normal', bloodImage);
    blood.life = 20;
  }
}

function flashLight() {
  push();
  fill(255, 255, 255);
  rect(0, 0, width, height);
  pop();
}

function generateStars() {
  stars.addStar();
  stars.run();
}

function collect(shipHead, mushroom) {
  mushroom.remove();
  mushroomsScore += 1;
  if (mushroomsScore % 5 == 0) {
    bulletsScore += 1;
  }
}

function punish() {
  lifeScore = lifeScore - 3;
  generateBlood();

  if (lifeScore < 0) {
    gameOver();
  }
}

function kill(bullet, enemy) {
  enemy.remove();
  bullet.remove();
}

function showScores() {
  textFont(regFont, 36);
  fill(255, 255, 200);
  image(mushroomImage, 25, 43, 30, 30);
  text(mushroomsScore, 95, 50);

  noStroke();
  fill(255, 110, 80);
  heart(160, 50, 20);
  text(lifeScore, 210, 50);

  fill(255, 255, 200);
  image(bulletImage, 270, 43, 30, 30)
  text(bulletsScore, 340, 50);
}

function heart(x, y, size) {
  beginShape();
  vertex(x, y);
  bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
  bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
  endShape(CLOSE);
}