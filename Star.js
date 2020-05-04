let Star = function(position) {
  this.acceleration = createVector(0, 0.01);
  this.velocity = createVector(random(-1, 1), random(-1, 0));
  this.position = position.copy();
  this.lifespan = 255;
};

Star.prototype.run = function() {
  this.update();
  this.display();
};

Star.prototype.update = function(){
  //this.velocity.add(this.acceleration);
  //this.position.add(this.velocity);
  this.lifespan -= 5;
};

Star.prototype.display = function() {
  stroke(255, this.lifespan);
  noStroke();
  fill(127, this.lifespan);
  ellipse(this.position.x, this.position.y, 3, 3);
};

Star.prototype.isDead = function(){
  return this.lifespan < 0;
};

let StarSystem = function(position) {
  this.origin = position.copy();
  this.particles = [];
};

StarSystem.prototype.addStar = function() {
  this.particles.push(new Star(createVector(random(0, width), random(0, height))));
};

StarSystem.prototype.run = function() {
  for (let i = this.particles.length-1; i >= 0; i--) {
    let s = this.particles[i];
    s.run();
    if (s.isDead()) {
      this.particles.splice(i, 1);
    }
  }
};