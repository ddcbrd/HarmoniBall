class Ball {

  constructor(x, y, r, os, en, i, c) {
    this.r = r;
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.vel.mult(3);
    this.osc = os;
    this.env = en;
    this.index = i;
    this.delta = new Array(nBalls);
    this.colliding = new Array(nBalls);
    this.colliding.fill(false);

    this.osc.amp(this.env);
    this.osc.start();
    this.color = c;

    this.trail = [];

  }

  checkBoundaries() {
    if ((this.pos.x - this.r) < 0) {
      this.vel.x *= -1;
      this.vel.mult(att);
      this.pos.x = this.r;
    }
    if ((this.pos.x + this.r) > width) {
      this.vel.x *= -1;
      this.vel.mult(att);
      this.pos.x = width - this.r;
    }

    if ((this.pos.y - this.r) < 0) {
      this.vel.y *= -1;
      this.vel.mult(att);
      this.pos.y = this.r;
    }
    if ((this.pos.y + this.r) > height) {
      this.vel.y *= -1;
      this.vel.mult(att);
      this.pos.y = height - this.r;
    }
  }

  applyForce(g) {
    this.vel.add(g);
    this.pos.add(this.vel);
    this.checkBoundaries();

    let pan = map(this.pos.x, 0, width, -1.0, 1.0);
    this.osc.pan(pan);
  }

  check(b) {
    if (this === b) return;
    let distance = p5.Vector.sub(b.pos, this.pos);
    let f = p5.Vector.fromAngle(distance.heading() + PI);
    this.delta[b.index] = distance.mag() - this.r - b.r;
    f.mult((this.r + b.r) / this.r);
    if (this.delta[b.index] <= 0 && !this.colliding[b.index]) {
      this.vel.add(f);
      this.vel.mult(att);
      this.playSound();
      this.colliding[b.index] = true;
      b.check(this);
    }
    else if (this.delta[b.index] > 0) this.colliding[b.index] = false;
  }

  show() {
    fill(this.color);
    noStroke();
    this.showTrail();
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  }

  playSound() {
    userStartAudio();
    this.env.play();
    console.log("playing -> " + this.index);
  }

  showTrail() {
    let tmpColor = this.color;
    let t = createVector(this.pos.x, this.pos.y, 255);
    this.trail.push(t);
    //this.trail.forEach(this.updateTrail)
    for (let i = 0; i < this.trail.length; i++) {
      if (this.trail[i].z > 0) {
        this.trail[i].z -= 3;
        let tR = map(this.trail[i].z, 0, 255, 0, this.r)
        tmpColor.setAlpha(this.trail[i].z);
        fill(tmpColor);
        ellipse(this.trail[i].x, this.trail[i].y, tR * 2, tR * 2);
      } else {
        //console.log("slicing");
        this.trail.shift();
      }
    }
  }
}